import { useState } from 'react'
import { useAsync } from 'react-use'
import _ from 'lodash'
import Styled from './styled'
import {
  Table,
  Card,
  Typography,
  Spin,
  Form,
  Row,
  Col,
  DatePicker,
  Button,
  Space,
  Tooltip,
  Modal,
  Select,
  notification
} from 'antd'
import {
  CheckOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  SearchOutlined
} from '@ant-design/icons'
import { getElectricityBillOverdueApi, approvePaymentOverdueApi } from '../../services/electricity_bill_overdue'
import moment from 'moment'
import { getDropdownRoomApi, getDropdownBuildingApi, getDropdownUserApi } from '../../services/filter'
import { ExportOverdueBillApi } from '../../services/export'

const { Title } = Typography;
const { Option } = Select;
const { confirm } = Modal;

export default function PageElectricityOverdue() {
  const [data, setData] = useState([])
  const [exportIds, setExportIds] = useState([])
  const [filters, setFilters] = useState({
    page: 1,
    size: 10,
    month: moment().format('MM'),
    year: moment().format('YYYY'),
  })
  const [total, setTotal] = useState(0)
  const [filtersSearch, setFiltersSearch] = useState({

  })
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('auth')))
  const [dropdownRoomNo, setDropdownRoomNo] = useState([])
  const [dropdownBuilding, setDropdownBuilding] = useState([])
  const [dropdownUser, setDropdownUser] = useState([])
  const [loadingPage, setLoadingPage] = useState(true)
  const _list = async () => {
    setLoadingPage(true)
    let data = await getElectricityBillOverdueApi({ ...filters, ...filtersSearch })
    setTotal(data.total)
    setData(data);
    // setFilters({
    //   ...filters,
    //   total: data.total
    // })
    setLoadingPage(false)
  }

  const getDropdown = async () => {

    setLoadingPage(true)
    let dataRoom = await getDropdownRoomApi()

    let dataBuilding = await getDropdownBuildingApi()

    let dataUser = await getDropdownUserApi()

    let tempData = []
    dataRoom.data.map((item) => {
      tempData.push({
        label: item?.room_no,
        value: item?.room_id,
      })
    })

    setDropdownRoomNo(tempData)

    tempData = []
    dataBuilding.data.map((item) => {
      tempData.push({
        label: item?.building_name,
        value: item?.building_name,
      })
    })

    setDropdownBuilding(tempData)

    tempData = []
    dataUser.data.map((item) => {
      tempData.push({
        label: item?.user_full_name,
        value: item?.user_id,
      })
    })

    setDropdownUser(tempData)

    setLoadingPage(false)

  }

  const columns = [
    {
      title: 'เลขห้อง',
      dataIndex: 'room_no',
      key: 'room_no',
      width: 100,
    },
    {
      title: 'ตึก',
      dataIndex: 'building',
      key: 'building',
      width: 100,
    },
    {
      title: 'ชื่อ-นามสกุล',
      dataIndex: 'tenant_name',
      key: 'tenant_name',
      width: 100,
    },
    {
      title: 'จำนวนที่เดือนที่ค้าง',
      dataIndex: 'month_overdue',
      key: 'month_overdue',
      width: 100,
    },
    {
      title: 'รวมเป็นเงิน',
      dataIndex: 'overdue_balance',
      key: 'overdue_balance',
      width: 100,
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: '5%',
      render: (text, record) => {
        return (
          <Space size="small">
            <Tooltip title={'Export Bill'}>
              <Button
                type="link"
                icon={<ExportOutlined />}
                onClick={async () => {
                  await ExportOverdueBillApi({ export_ids: [record.room_id]})
                }}
              />
            </Tooltip>
            <Tooltip title={'Comfirm Payment'}>
              <Button
                type="link"
                disabled={authUser != null && authUser?.user.is_admin == 1?false:true}
                icon={<CheckOutlined />}
                onClick={async () => {
                  showPropsConfirm(record.room_id)
                }}
              />
            </Tooltip>
          </Space>
        )
      },
    }
  ];

  const showPropsConfirm = (room_id) => {
    confirm({
      title: 'คุณต้องการยืนยันการจ่ายเงินไช่หรือไม่?',
      icon: <ExclamationCircleOutlined />,
      // content: 'Some descriptions',
      okText: 'Yes',
      okType: 'primary',
      cancelText: 'No',
      onOk: async() => {
        await approvePaymentOverdueApi(room_id)
        await _list()
      },
      onCancel() {
        // console.log('Cancel');
      },
    });
  }

  useAsync(async () => {
    setLoadingPage(true)
    await getDropdown()
    await _list()
    setAuthUser(JSON.parse(localStorage.getItem('auth')))
    setLoadingPage(false)
  }, [filters])

  return (
    <Styled className='page page-electricity'>
      <Spin spinning={loadingPage} tip="Loading...">
        <Card>
          <Title level={4}>Electricity Payment</Title>
          <Form
            layout="horizontal"
          // onValuesChange={onFormLayoutChange}
          >
            <Row>
              <Col xs={24} lg={6} style={{ paddingRight: 5 }}>
                <Form.Item label="เลขห้อง" name="room_id">
                  <Select
                    mode="multiple"
                    style={{ width: '100%' }}
                    placeholder="เลขห้อง"
                    options={dropdownRoomNo}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        room_id: value
                      })
                    }}
                  >
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={6} >
                <Form.Item label="ตึก" name="building_name">
                  <Select
                    mode="multiple"
                    style={{ width: '100%', paddingRight: 5 }}
                    placeholder="เลขห้อง"
                    options={dropdownBuilding}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        building_name: value
                      })
                    }}
                  >
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={6}>
                <Form.Item label="ชื่อผู้เช่า" name="user_id">
                  <Select
                    mode="multiple"
                    style={{ width: '100%', paddingRight: 5 }}
                    placeholder="ชื่อผู้เช่า"
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        user_id: value
                      })
                    }}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    options={dropdownUser}
                  >
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={6} style={{ paddingRight: 5 }}>
                <Button
                  icon={<SearchOutlined/>}
                  type="primary"
                  htmlType="submit"
                  style={{ float: 'right' }}
                  onClick={() => {
                    _list()
                  }}>
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card>
          <Space style={{ paddingBottom: 5 }}>
            <Button
              type="danger"
              icon={<ExportOutlined/>}
              onClick={async () => {
                if (exportIds.length == 0) {
                  notification.warn({
                    message: `แจ้งเตือน`,
                    description:
                      'กรุณาเลือกข้อมูลที่ต้องการส่งออก',
                  })
                } else {
                  await ExportOverdueBillApi({ export_ids: exportIds})
                }
              }}
            >
              Export Bill
            </Button>
          </Space>
          <Form>
            <Table
              rowSelection={{
                type: 'checkbox',
                onChange: (selectedRowKeys, selectedRows) => {
                  let tempData = []

                  selectedRows.map(item => {
                    tempData.push(item.room_id)
                  })

                  setExportIds(tempData)
                }
              }}
              columns={columns}
              dataSource={data.items}
              scroll={{ x: 500 }}
              pagination={{
                current: filters.page,
                pageSize: filters.size,
                total: total,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} items`
              }}
              onChange={async (pagination) => {
                await setFilters({
                  ...filters,
                  page: pagination.current,
                  size: pagination.pageSize,
                })

              }}
            />
          </Form>
        </Card>
      </Spin>
    </Styled>
  )
}
