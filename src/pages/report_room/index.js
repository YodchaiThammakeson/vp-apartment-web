import { useState } from 'react'
import { useAsync } from 'react-use'
import _ from 'lodash'
import Styled from './styled'
import 'antd/dist/antd.css';
import './styled.css'
import {
  createImageApi,
  getImageApi
} from '../../services/image'
import MyUploadPreview from '../../components/UploadPreview'
import {
  Spin,
  Card,
  Typography,
  Input,
  Form,
  Row,
  Col,
  Image,
  Button,
  Space,
  Tooltip,
  Modal,
  Select,
  Upload,
  Table,
  DatePicker
} from 'antd'
import {
  DeleteOutlined,
  SearchOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  PlusOutlined
} from '@ant-design/icons'
import {
  getDropdownRoomApi,
  getDropdownBuildingApi,
  getDropdownRoomTypeApi,
  getDropdownRoomStatusApi,
  getDropdownUserApi
} from '../../services/filter'
import {
  getAllRequestRoomApi,
  updateRejectRoomApi,
  updateApproveRoomApi
} from '../../services/reserving';
const { Title, Text } = Typography;
const { Option } = Select;
const { Meta } = Card;
const { TextArea } = Input;

export default function PageReportRoom() {

  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [actionId, setActionId] = useState(null)
  const [actionName, setActionName] = useState(null)
  const [form] = Form.useForm()
  const [loadingPage, setLoadingPage] = useState(true)

  const [filters, setFilters] = useState({
    page: 1,
    size: 10
  })

  const [filtersSearch, setFiltersSearch] = useState({

  })

  const [fileList, setFileList] = useState([])

  const [dropdownRoomNo, setDropdownRoomNo] = useState([])
  const [dropdownBuilding, setDropdownBuilding] = useState([])
  const [dropdownRoomType, setDropdownRoomType] = useState([])
  const [dropdownRoomStatus, setDropdownRoomStatus] = useState([])
  const [dropdownUser, setDropdownUser] = useState([])
  const [disabledEffectiveDate, setDisabledEffectiveDate] = useState(true)

  const confirmDelete = () => {
    Modal.confirm({
      title: "Delete",
      icon: <ExclamationCircleOutlined />,
      content: "คุณต้องการลบข้อมูลนี้ใช่หรือไม่",
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: () => {
        // alert('1')
      }
    });
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
      dataIndex: 'building_name',
      key: 'building_name',
      width: 100,
    },
    {
      title: 'ประเภทห้อง',
      dataIndex: 'room_type',
      key: 'room_type',
      width: 100,
    },
    {
      title: 'ชื่อผู้เช่า',
      dataIndex: 'user_full_name',
      key: 'user_full_name',
      width: 100,
    },
    {
      title: 'วันที่ร้องขอ',
      dataIndex: 'request_date',
      key: 'request_date',
      width: 100,
      render: (text, record) => {
        let renderText = ''
        // if(record.room_status == 'จอง'){
        renderText = record.request_date
        // }

        return (renderText)
      }
    },
    {
      title: 'วันที่ที่มีผล',
      dataIndex: 'eff_date',
      key: 'eff_date',
      width: 100,
      render: (text, record) => {
        let renderText = ''
        if(record.room_status == 'จอง' || record.room_status == 'ขอย้ายห้อง'){
          renderText = record.reserv_stay_in_date
        }else if(record.room_status == 'ขอย้ายออก'){
          renderText = record.leave_date
        }

        return (renderText)
      }
    },
    {
      title: 'ห้องที่ขอย้าย',
      dataIndex: 'room_change_id',
      key: 'room_change_id',
      width: 100,
      render: (text, record) => {
        let renderText = ''
        if(record.room_status == 'ขอย้ายห้อง'){
          renderText = record.change_room_name + " ตึก " + record.change_building_name
        }

        return (renderText)
      }
    },
    {
      title: 'สถานะ',
      dataIndex: 'room_status',
      key: 'room_status',
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
            <Tooltip title={'reserv'}>
              <Button
                type="link"
                icon={<ExportOutlined />}
                onClick={async () => {
                  setActionId(record.room_id)
                  let files = await getImageApi({ reserv_bill: record.room_id })
                  const filesData = []

                  files?.data.map((item) => {
                    filesData.push({
                      uid: item?.file_id,
                      name: item?.file_name,
                      status: 'done',
                      url: `${process.env.REACT_APP_SERVICE_URL}${item.file_path}`,
                    })
                  })
                  if(record.room_status == "จอง"){
                    setDisabledEffectiveDate(true)
                  }else{
                    setDisabledEffectiveDate(false)
                  }
                    

                  form.setFieldsValue({
                    room_id: record.room_no,
                    building_name: record.building_name,
                    room_type: record.room_type,
                    room_detail: record.room_detail,
                    deposit_amount: record.deposit_amount,
                    rental_balance: record.rental_balance,
                    user_id: record.user_id,
                    images: filesData
                  })
                  setFileList(filesData)
                  showModal2()
                }}
              />
            </Tooltip>

          </Space>
        )
      },
    }
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [contentViewModel, setContentViewModel] = useState('');
  const showModal = () => {
    setIsModalVisible(true);
  };


  const [isModal2Visible, setIsModal2Visible] = useState(false);

  const showModal2 = () => {
    setIsModal2Visible(true);
    setContentViewModel(
      // <div style={{ 'text-align': 'center', paddingBottom: 5 }}>
      //   <Image
      //     width={200}
      //     className="center-img"
      //     src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
      //   />
      // </div>

    )
  };

  const handleCancel2 = () => {
    setIsModal2Visible(false);
  }

  const _list = async () => {
    setLoadingPage(true)
    let data = await getAllRequestRoomApi({ ...filters, ...filtersSearch})

    setTotal(data.total)
    setData(data)
    setLoadingPage(false)
  }

  const getDropdown = async () => {
    setLoadingPage(true)
    let dataRoom = await getDropdownRoomApi()

    let dataBuilding = await getDropdownBuildingApi()

    let dataRoomType = await getDropdownRoomTypeApi()

    let dataRoomStatus = await getDropdownRoomStatusApi()

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
    dataRoomType.data.map((item) => {
      tempData.push({
        label: item?.room_type,
        value: item?.room_type,
      })
    })

    setDropdownRoomType(tempData)

    tempData = []
    tempData.push({
      label: 'ทั้งหมด',
      value: 'ทั้งหมด',
    })
    dataRoomStatus.data.map((item) => {
      tempData.push({
        label: item?.room_status,
        value: item?.room_status,
      })
    })

    setDropdownRoomStatus(tempData)

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

  useAsync(async () => {
    // setLoadingPage(true)
    await _list({ ...filters, ...filtersSearch, page: 1 })
    await getDropdown()
    // setLoadingPage(false)
  }, [filters])

  return (
    <Styled className='page page-report-room'>
      <Spin spinning={loadingPage} tip="Loading...">
        <Card>
          <Title level={4}>Report Room</Title>
          <Form
            layout="horizontal"
          // onValuesChange={onFormLayoutChange}
          >
            <Row>
              <Col xs={24} lg={6} style={{ paddingRight: 10 }}>
                <Form.Item
                  label="ชื่อห้อง"
                  name="room_id">
                  <Select
                    showSearch
                    mode='multiple'
                    placeholder="Room"
                    optionFilterProp="children"
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        room_id: value
                      })
                    }}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    options={dropdownRoomNo}
                  >

                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={6} style={{ paddingRight: 10 }}>
                <Form.Item
                  label="ตึก"
                  name="building">
                  <Select
                    showSearch
                    mode='multiple'
                    placeholder="Building"
                    optionFilterProp="children"
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        building_name: value
                      })
                    }}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    options={dropdownBuilding}
                  >
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={6} style={{ paddingRight: 10 }}>
                <Form.Item
                  label="ประเภทห้อง"
                  name="room_type">
                  <Select
                    showSearch
                    mode='multiple'
                    placeholder="Room Type"
                    optionFilterProp="children"
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        room_type: value
                      })
                    }}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    options={dropdownRoomType}
                  >
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={6} style={{ paddingRight: 10 }}>
                <Form.Item
                  label="สถานะ"
                  name="room_status">
                  <Select
                    showSearch
                    placeholder="Status"
                    optionFilterProp="children"
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        room_status: value
                      })
                    }}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    defaultValue={'ทั้งหมด'}
                    options={dropdownRoomStatus}
                  >
                  </Select>
                </Form.Item>
              </Col>
            </Row>
            <Row>
              <Col xs={24} lg={24}>
                <Button
                  icon={<SearchOutlined/>}
                  type="primary"
                  htmlType="submit"
                  style={{ float: 'right' }}
                  onClick={async () => {
                    await _list()
                  }}
                >
                  Search
                </Button>
              </Col>
            </Row>
          </Form>
        </Card>
        <Card>
          <Space style={{ paddingBottom: 5 }}>
            {/* <Button type='' onClick={() => { setIsModal3Visible(true) }}>รายอะเอียดสัญญา</Button> */}
          </Space>
          <Card>
            <Table
              columns={columns}
              dataSource={data?.items}
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
          </Card>
        </Card>
        <Modal
          visible={isModal2Visible}
          title="Room Detail"
          onCancel={handleCancel2}
          footer={[
            <Button key="back" onClick={handleCancel2}>
              Cancel
            </Button>,
            <Button
              key="submit"
              type="danger"
              onClick={async () => {
                setActionName('reject')
                form.submit()
              }}
            >
              ไม่อนุมัติ
            </Button>,
            <Button
              key="submit"
              type="primary"
              onClick={async () => {
                setActionName('approve')
                form.submit()
              }}
            >
              อนุมัติ
            </Button>,
          ]}
        >
          <Spin spinning={loadingPage} tip="Loading...">
            {contentViewModel}
            <Form
              form={form}
              onFinish={async (value) => {
                setLoadingPage(true)
                if (actionName == 'approve') {
                  await updateApproveRoomApi(actionId,value)
                } else if (actionName == 'reject') {
                  await updateRejectRoomApi(actionId)
                }
                handleCancel2()
                await _list()
              }}
            >
              <Form.Item
                label="ชื่อห้อง"
                name="room_id"
                labelCol={{ span: 6 }}>
                <Input disabled={true} placeholder="ชื่อห้อง" />
              </Form.Item>
              <Form.Item
                label="ประเภทห้อง"
                name="room_type"
                labelCol={{ span: 6 }}>
                <Input disabled={true} placeholder="ประเภทห้อง" />
              </Form.Item>
              <Form.Item label="ชื่อคนเช่า" name="user_id" labelCol={{ span: 6 }}>
                <Select
                  mode="multiple"
                  disabled={true}
                  style={{ width: '100%', paddingRight: 5 }}
                  placeholder="ชื่อคนเช่า"
                  options={dropdownUser}
                >
                </Select>
              </Form.Item>
              <Form.Item
                label="รายเอียดละเอียด"
                name="room_detail"
                labelCol={{ span: 6 }}>
                <TextArea disabled={true} rows={4} />
              </Form.Item>
              <Form.Item
                label="ค่าเช่าห้อง"
                name="rental_balance"
                labelCol={{ span: 6 }}>
                <Input disabled={true} placeholder="ค่าเช่าห้อง" />
              </Form.Item>
              <Form.Item
                label="วันที่เปิดห้อง"
                name="effective_date"
            
                labelCol={{ span: 6 }}>
                <DatePicker style={{width:'100%'}} disabled={disabledEffectiveDate} placeholder="วันที่เปิดห้อง" />
              </Form.Item>
              <Form.Item
               label="ชื่อห้อง"
                name="images"
                labelCol={{ span: 6 }}>
                <MyUploadPreview />
              </Form.Item>
            </Form>
          </Spin>
        </Modal>
      </Spin>
    </Styled>
  )
}
