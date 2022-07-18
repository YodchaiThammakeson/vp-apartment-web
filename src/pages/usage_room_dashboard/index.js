import { useState } from 'react'
import { useAsync } from 'react-use'
import _ from 'lodash'
import Styled from './styled'
import moment from 'moment'
import {
  Table,
  Card,
  Typography,
  Input,
  Form,
  Row,
  Col,
  DatePicker,
  Button,
  Space,
  Tooltip,
  Modal,
  Select,
  Spin
} from 'antd'
import {
  SearchOutlined,
} from '@ant-design/icons'
import { getUsageRoomDashboardApi } from '../../services/dashboard'
import { getDropdownRoomApi } from '../../services/filter'
import { Line } from '@ant-design/plots';
const { Title } = Typography;
const { Option } = Select;

export default function PageUsageRoomDashboard() {
  const [dataElectric, setDataElectric] = useState([])
  const [dataWater, setDataWater] = useState([])
  const [dropdownRoomNo, setDropdownRoomNo] = useState([])
  const [total, setTotal] = useState(0)
  const configElectric = {
    data: dataElectric,
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    xAxis: {
    },
    yAxis: {
      label: {
        formatter: (v) => `${v}`,
      },
    },
  };

  const configWater = {
    data: dataWater,
    xField: 'year',
    yField: 'value',
    seriesField: 'category',
    xAxis: {
    },
    yAxis: {
      label: {
        formatter: (v) => `${v}`,
      },
    },
  };

  const [loadingPage, setLoadingPage] = useState(true)
  const [filtersSearch, setFiltersSearch] = useState({
    year : null
  })

  const getDropdown = async () => {
    setLoadingPage(true)
    let dataRoom = await getDropdownRoomApi()


    let tempData = []
    dataRoom.data.map((item) => {
      if (item.room_status == 'สำเร็จ') {
        tempData.push({
          label: `${item?.room_no} ตึก ${item?.building_name}`,
          value: item?.room_id,
        })
      }
    })

    setDropdownRoomNo(tempData)

    setLoadingPage(false)
  }

  const _list = async () => {
    setLoadingPage(true)
    let data = await getUsageRoomDashboardApi({ ...filtersSearch })

    setDataElectric(data.data_electric)
    setDataWater(data.data_water)
    console.log(data.data_electric)
    
    setLoadingPage(false)
  }

  useAsync(async () => {
    // setLoadingPage(true)
    await _list()
    await getDropdown()
    // setLoadingPage(false)
  }, [])

  return (
    <Styled className='page page-monthly-dashboard'>
      <Spin spinning={loadingPage} tip="Loading...">
      <Card>
        <Title level={4}>Usage room dashboard</Title>
        <Form
          layout="horizontal"
        // onValuesChange={onFormLayoutChange}
        >
          <Row>
          <Col xs={24} lg={6} style={{ paddingRight: 5 }}>
          <Form.Item label="ห้อง">
            <Select
                    mode="multiple"
                    options={dropdownRoomNo}
                    style={{ width: '100%' }}
                    placeholder="เลขห้อง"
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        room_id: value
                      })
                    }}
                  ></Select>
          </Form.Item>
          </Col>
          <Col xs={24} lg={6} style={{ paddingRight: 5 }}>
          <Form.Item label="ปี">
            <DatePicker
              style={{ width: '100%' }}
              picker="year"
              onChange={(value) => {
                console.log(value)
                setFiltersSearch({
                  ...filtersSearch,
                  year: value == null ? null:moment(value).format('YYYY')
                })
              }}
            />
          </Form.Item>
          </Col>
          </Row>
          <Button
                  icon={<SearchOutlined />}
                  type="primary"
                  htmlType="submit"
                  style={{ float: 'right' }}
                  onClick={async (value) => {
                    await _list()
                  }}
                >
                  Search
                </Button>
        </Form>
      </Card>
      <Card>
        <Row>
           <Col xs={24} lg={11}>
            <Title level={4}>Summary Electricity</Title>
            <Line {...configElectric} />;
           </Col>
           <Col xs={24} lg={2}></Col>
           <Col xs={24} lg={11}>
           <Title level={4}>Summary Water</Title>
            <Line {...configWater} />;
           </Col>
        </Row>
        
      </Card>
      </Spin>
    </Styled>
  )
}
