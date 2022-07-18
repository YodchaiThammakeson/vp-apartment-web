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
import { getSummaryDashboardApi } from '../../services/dashboard'
import { Pie, Column } from '@ant-design/plots';
const { Title } = Typography;
const { Option } = Select;

export default function PageMonthlyDashboard() {
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const config = {
    appendPadding: 10,
    data,
    angleField: 'value',
    colorField: 'type',
    radius: 1,
    innerRadius: 0.6,
    label: {
      type: 'inner',
      offset: '-50%',
      content: '{value}',
      style: {
        textAlign: 'center',
        fontSize: 14,
      },
    },
    interactions: [
      {
        type: 'element-selected',
      },
      {
        type: 'element-active',
      },
    ],
    statistic: {
      title: false,
      content: {
        style: {
          whiteSpace: 'pre-wrap',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
        },
        content: `รวม ${total}`,
      },
    },
  };


  const [dataColums, setDataColums] = useState([])

  const configColums = {
    data: dataColums,
    isStack: true,
    xField: 'year',
    yField: 'value',
    seriesField: 'type',
    label: {
      position: 'middle',
      // 'top', 'bottom', 'middle'
      layout: [
        {
          type: 'interval-adjust-position',
        }, 
        {
          type: 'interval-hide-overlap',
        },
        {
          type: 'adjust-color',
        },
      ],
    },
  };

  const [loadingPage, setLoadingPage] = useState(true)
  const [filtersSearch, setFiltersSearch] = useState({
    month: moment().format('MM'),
    year: moment().format('YYYY'),
  })

  const _list = async () => {
    setLoadingPage(true)
    let data = await getSummaryDashboardApi({ ...filtersSearch })

    setData(data.data)
    setDataColums(data.dataColums)
    setTotal(data.total)
    setLoadingPage(false)
  }

  useAsync(async () => {
    // setLoadingPage(true)
    await _list()
    // setLoadingPage(false)
  }, [])

  return (
    <Styled className='page page-monthly-dashboard'>
      <Spin spinning={loadingPage} tip="Loading...">
      <Card>
        <Title level={4}>Summary dashboard</Title>
        <Form
          layout="horizontal"
        // onValuesChange={onFormLayoutChange}
        >
          <Form.Item label="เดือน ปี"
            wrapperCol={{ span: 6 }}
          >
            <DatePicker
              defaultValue={moment()}
              style={{ width: '100%' }}
              picker="month"
              onChange={(value) => {
                setFiltersSearch({
                  ...filtersSearch,
                  month: moment(value).format('MM'),
                  year: moment(value).format('YYYY')
                })
              }}
            />
          </Form.Item>
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
           <Col xs={24} lg={8}>
            <Pie  {...config} />
           </Col>
           <Col xs={24} lg={8}>
            <Column  {...configColums} />
           </Col>
        </Row>
        
      </Card>
      </Spin>
    </Styled>
  )
}
