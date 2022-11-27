import { useState } from 'react'
import { useAsync } from 'react-use'
import _ from 'lodash'
import Styled from './styled'
import 'antd/dist/antd.css'
import './styled.css'
import MyUpload from '../../components/Upload'
import MyUploadPreview from '../../components/UploadPreview'
import {
  Statistic,
  Card,
  Typography,
  Input,
  Form,
  Row,
  Col,
  InputNumber,
  Button,
  Space,
  Tooltip,
  Modal,
  Select,
  Table,
  Spin
} from 'antd'
import {
  DeleteOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  ExportOutlined,
  PlusOutlined,
  SearchOutlined,
  CheckOutlined
} from '@ant-design/icons'
import {
  getRoomApi,
  createRoomApi,
  updateRoomApi,
  deleteRoomApi,
  getRoomSummaryApi
} from '../../services/room';
import {
  getDropdownRoomApi,
  getDropdownBuildingApi,
  getDropdownRoomTypeApi,
  getDropdownBalanceRoomApi
} from '../../services/filter'
import {
  createImageApi,
  getImageApi
} from '../../services/image'
const { Title, Text } = Typography;
const { Option } = Select;
const { Meta } = Card;
const { TextArea } = Input;

export default function PageRoom() {

  const [data, setData] = useState([])
  const [dataSummary, setDataSummary] = useState([])
  const [fileList, setFileList] = useState([])
  const [form] = Form.useForm()
  const [formView] = Form.useForm()
  const [authUser,setAuthUser] = useState(JSON.parse(localStorage.getItem('auth')))

  const [actionId, setActionId] = useState(null)
  const [loadingPage, setLoadingPage] = useState(true)

  const [filters, setFilters] = useState({
    page: 1,
    size: 10
  })

  const [filtersSearch, setFiltersSearch] = useState({

  })

  const [dropdownRoomNo, setDropdownRoomNo] = useState([])
  const [dropdownBuilding, setDropdownBuilding] = useState([])
  const [dropdownRoomType, setDropdownRoomType] = useState([])
  const [dropdownBalanceRoom, setDropdownBalanceRoom] = useState([])

  const _list = async () => {
    setLoadingPage(true)
    let data = await getRoomApi({ ...filters, ...filtersSearch})
    let dataSummary = await getRoomSummaryApi()
    setData(data)
    setDataSummary(dataSummary)
    setTotal(data.total)
    setLoadingPage(false)
  }

  const confirmDelete = (delId) => {
    Modal.confirm({
      title: "Delete",
      icon: <ExclamationCircleOutlined />,
      content: "คุณต้องการลบข้อมูลนี้ใช่หรือไม่",
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        await deleteRoomApi(delId)
        _list()
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
      title: 'รายละเอียด',
      dataIndex: 'room_detail',
      key: 'room_detail',
      width: 100,
    },
    {
      title: 'มัดจำ',
      dataIndex: 'deposit_amount',
      key: 'deposit_amount',
      width: 100,
    },
    {
      title: 'ราคา',
      dataIndex: 'rental_balance',
      key: 'rental_balance',
      width: 100,
    },
    {
      title: 'ค้างชำระ',
      dataIndex: 'outstanding_balance',
      key: 'outstanding_balance',
      width: 100,
      render: (text, record) => {
        return text || 0
      }
    },
    {
      title: 'สถานะห้อง',
      dataIndex: 'room_status',
      key: 'room_status',
      width: 100
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: '5%',
      render: (text, record) => {
        return (
          <Space size="small">
            <Tooltip title={'view'}>
              <Button
                type="link"
                icon={<ExportOutlined />}
                onClick={async () => {
                  let files = await getImageApi({ room_id: record.room_id })
                  const filesData = []

                  files?.data.map((item) => {
                    filesData.push({
                      uid: item?.file_id,
                      name: item?.file_name,
                      status: 'done',
                      url: `${item.file_path}`,
                    })
                  })


                  formView.setFieldsValue({
                    room_no: record.room_no,
                    building_name: record.building_name,
                    room_type: record.room_type,
                    room_detail: record.room_detail,
                    deposit_amount: record.deposit_amount,
                    rental_balance: record.rental_balance,
                    images: filesData
                  })
                  setFileList(filesData)
                  showModal2()

                }}
              />
            </Tooltip>
            <Tooltip title={'Edit'}>
              <Button
                type="link"
                disabled={authUser?.user.is_admin == 1?false:true}
                icon={<SettingOutlined />}
                onClick={async () => {
                  setActionId(record.room_id)
                  let files = await getImageApi({ room_id: record.room_id })
                  const filesData = []

                  files?.data.map((item) => {
                    filesData.push({
                      uid: item?.file_id,
                      name: item?.file_name,
                      status: 'done',
                      url: `${item.file_path}`,
                    })
                  })

                  form.setFieldsValue({
                    room_no: record.room_no,
                    building_name: record.building_name,
                    room_type: record.room_type,
                    room_detail: record.room_detail,
                    deposit_amount: record.deposit_amount,
                    rental_balance: record.rental_balance,
                    images: filesData
                  })
                  setFileList(filesData)
                  showModal()
                }}
              />
            </Tooltip>
            <Tooltip title={'Delete'}>
              <Button
                type="link"
                disabled={authUser?.user.is_admin == 1?false:true}
                danger
                icon={<DeleteOutlined />}
                onClick={async () => {
                  setActionId(record.room_id)
                  confirmDelete(record.room_id)
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

  const [total, setTotal] = useState(0)
  const [isModal2Visible, setIsModal2Visible] = useState(false);

  const showModal2 = () => {
    setIsModal2Visible(true);
    setContentViewModel(
      <div>
        <div style={{ textAlign: 'center', paddingBottom: 5 }}>
          {/* <Image
            width={200}
            className="center-img"
            src="https://zos.alipayobjects.com/rmsportal/jkjgkEfvpUPVyRjUImniVslZfWPnJuuZ.png"
          /> */}
        </div>
        <Form
          form={formView}
        >
          <Form.Item
            // label="ชื่อห้อง"
            name="images"
            labelCol={{ span: 6 }}>
            <MyUploadPreview />
          </Form.Item>
          <Form.Item
            label="ชื่อห้อง"
            name="room_no"
            labelCol={{ span: 6 }}>
            <Input disabled={true} placeholder="ชื่อห้อง" />
          </Form.Item>
          <Form.Item
            label="ประเภทห้อง"
            name="room_type"
            labelCol={{ span: 6 }}>
            <Input disabled={true} placeholder="ประเภทห้อง" />
          </Form.Item>
          {/* <Form.Item label="ชื่อคนเช่า" name="user_name" labelCol={{ span: 6 }}>
            <Select
              mode="multiple"
              style={{ width: '100%', paddingRight: 5 }}
              placeholder="ชื่อคนเช่า"
            >
              <Option key={1}>ชื่อ นามสกุล</Option>
              <Option key={2}>ชื่อ นามสกุล</Option>
              <Option key={3}>ชื่อ นามสกุล</Option>
            </Select>
          </Form.Item> */}
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
        </Form>
      </div>
    )
  };

  const handleCancel2 = () => {
    setIsModal2Visible(false);
  }

  const getDropdown = async () => {
    setLoadingPage(true)
    let dataRoom = await getDropdownRoomApi()

    let dataBuilding = await getDropdownBuildingApi()

    let dataRoomType = await getDropdownRoomTypeApi()

    let dataBalanceRoom = await getDropdownBalanceRoomApi()


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
    dataBalanceRoom.data.map((item) => {
      tempData.push({
        label: item?.rental_balance,
        value: item?.rental_balance,
      })
    })

    setDropdownBalanceRoom(tempData)

    setLoadingPage(false)
  }

  useAsync(async () => {
    // setLoadingPage(true)
    await _list({ ...filters, ...filtersSearch})
    await getDropdown()
    setAuthUser(JSON.parse(localStorage.getItem('auth')))
    // setLoadingPage(false)
  }, [filters])

  return (
    <Styled className='page page-room'>
      <Spin spinning={loadingPage} tip="Loading...">
        <Card>
          <Title level={4}>Room Detail</Title>
          <Form
            layout="horizontal"
          // onValuesChange={onFormLayoutChange}
          >
            <Row >
              <Col xs={24} lg={6} style={{ paddingRight: 10 }}>
                <Form.Item
                  label="ชื่อห้อง"
                  name="room_id">
                  <Select
                    showSearch
                    mode='multiple'
                    placeholder="Room"
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    // optionFilterProp="children"
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        room_id: value
                      })
                    }}
                    // onSearch={onSearch}
                    // filterOption={(input, option) =>
                    //   option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    // }
                    options={dropdownRoomNo}
                  >

                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={6} style={{ paddingRight: 10 }}>
                <Form.Item
                  label="ตึก"
                  name="building_name">
                  <Select
                    showSearch
                    mode='multiple'
                    placeholder="Building"
                    // optionFilterProp="children"
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        building_name: value
                      })
                    }}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    options={dropdownBuilding}
                  >

                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={6} style={{ paddingRight: 10 }}>
                <Form.Item
                  label="ประเภทห้อง"
                  mode='multiple'
                  name="room_type">
                  <Select
                    showSearch
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
                  label="ราคา"
                  name="rental_balance">
                  <Select
                    showSearch
                    placeholder="Rental Balance"
                    optionFilterProp="children"
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        rental_balance: value
                      })
                    }}
                    // onSearch={onSearch}
                    filterOption={(input, option) =>
                      option.label.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                    options={dropdownBalanceRoom}
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
            <Button disabled={authUser?.user.is_admin == 1?false:true} icon={<PlusOutlined/>} type='primary' onClick={() => {
              setActionId(null)
              showModal()
              form.resetFields()
            }}>Add Room</Button>
          </Space>
          <div className="site-statistic-demo-card">
            <Row >
              <Col xs={24} lg={8}>
                <Card>
                  <Statistic
                    title="จำนวนห้องทั้งหมด"
                    value={dataSummary?.data?.all_room}
                    precision={2}
                    valueStyle={{ color: '#000000' }}
                    suffix="ห้อง"
                  />
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card>
                  <Statistic
                    title="จำนวนห้องที่ถูกเช่า"
                    value={dataSummary?.data?.room_unavailable}
                    precision={2}
                    valueStyle={{ color: '#13CF2C' }}
                    suffix="ห้อง"
                  />
                </Card>
              </Col>
              <Col xs={24} lg={8}>
                <Card>
                  <Statistic
                    title="จำนวนห้องที่ว่าง"
                    value={dataSummary?.data?.room_available}
                    precision={2}
                    valueStyle={{ color: '#cf1322' }}
                    suffix="ห้อง"
                  />
                </Card>
              </Col>
            </Row>
          </div>
          <Card>
            <Table
              columns={columns}
              dataSource={data?.items}
              scroll={{ x: 500 }}
              pagination={{
                current: filters.page,
                pageSize: filters.size,
                total,
                showQuickJumper: true,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} items`,
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
          title="Add/Update Room"
          className='custom-modal'
          visible={isModalVisible}
          onOk={() => {
            form.submit()
          }}
          onCancel={() => setIsModalVisible(false)}
        >
          <Spin spinning={loadingPage} tip="Loading...">
            <Form
              form={form}
              onFinish={async (value) => {
                setLoadingPage(true)
                let room_id = null
                if (actionId == null) {
                  let newItem = await createRoomApi(value)
                  room_id = newItem.room_id
                } else {
                  await updateRoomApi(value, actionId)
                  room_id = actionId
                }

                let not_del_ids = []
                let images = []


                value.images.map(item => {
                  if (item.status == 'done') {
                    not_del_ids.push(item.uid)
                  } else {
                    images.push(item.originFileObj)
                  }
                })

                await createImageApi({ room_id: room_id }, not_del_ids, images)
                setIsModalVisible(false)
                await getDropdown()
                await _list()
              }}
            >
              <Form.Item
                label="ชื่อห้อง"
                name="room_no"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกชื่อห้อง',
                  },
                ]}
                >
                <Input placeholder="ชื่อห้อง" />
              </Form.Item>
              <Form.Item
                label="ชื่อตึก"
                name="building_name"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกชื่อตึก',
                  },
                ]}
                >
                <Input placeholder="ชื่อตึก" />
              </Form.Item>
              <Form.Item
                label="ประเภทห้อง"
                name="room_type"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกประเภทห้อง',
                  },
                ]}
                >
                <Input placeholder="ประเภทห้อง" />
              </Form.Item>
              <Form.Item
                label="รายเอียดละเอียด"
                name="room_detail"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกรายเอียดละเอียดห้อง',
                  },
                ]}
                >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                label="ค่ามัดจำ"
                name="deposit_amount"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกค่ามัดจำ',
                  },
                ]}
                >
                <InputNumber style={{ width: '100%' }} placeholder="ค่ามัดจำ" />
              </Form.Item>
              <Form.Item
                label="ค่าเช่าห้อง"
                name="rental_balance"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกค่าเช่าห้อง',
                  },
                ]}
                >
                <InputNumber style={{ width: '100%' }} placeholder="ค่าเช่าห้อง" />
              </Form.Item>
              <Form.Item
                label="รูปห้อง"
                name="images"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณาใส่รูปห้อง',
                  },
                ]}
                >
                <MyUpload />

              </Form.Item>
            </Form>
          </Spin>
        </Modal>
        <Modal
          visible={isModal2Visible}
          width={"80%"}
          title="Room Detail"
          onCancel={handleCancel2}
          footer={[
            <Button key="back" onClick={handleCancel2}>
              Cancel
            </Button>,
          ]}
        >
          {contentViewModel}
        </Modal>
      </Spin>
    </Styled>
  )
}

