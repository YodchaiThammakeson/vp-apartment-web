import { useState } from 'react'
import { useAsync } from 'react-use'
import _ from 'lodash'
import Styled from './styled'
import 'antd/dist/antd.css'
import './styled.css'
import MyUploadPreview from '../../components/UploadPreview'
import moment from 'moment'
import MyUpload from '../../components/Upload';
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
  DatePicker,
  Table,
  notification
} from 'antd'
import {
  DeleteOutlined,
  SettingOutlined,
  InfoCircleOutlined,
  ExportOutlined,
  SearchOutlined,
  CheckOutlined
} from '@ant-design/icons'
import {
  getDropdownRoomApi,
  getDropdownBuildingApi,
  getDropdownRoomTypeApi,
  getDropdownBalanceRoomApi,
  getDropdownUserApi
} from '../../services/filter'
import {
  getReservingRoomApi,
  updateReservingRoomApi
} from '../../services/reserving';
import {
  createImageApi,
  getImageApi
} from '../../services/image'

const { Title, Text } = Typography;
const { Option } = Select;
const { Meta } = Card;
const { TextArea } = Input;

export default function PageReservRoom() {

  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)
  const [actionId, setActionId] = useState(null)
  const [effectiveDate, setEffectiveDate] = useState(null)
  const [form] = Form.useForm()
  const [loadingPage, setLoadingPage] = useState(true)

  const [filters, setFilters] = useState({
    page: 1,
    size: 10
  })

  const [filtersSearch, setFiltersSearch] = useState({

  })

  const [authUser,setAuthUser] = useState(JSON.parse(localStorage.getItem('auth')))

  const [dropdownRoomNo, setDropdownRoomNo] = useState([])
  const [dropdownBuilding, setDropdownBuilding] = useState([])
  const [dropdownRoomType, setDropdownRoomType] = useState([])
  const [dropdownBalanceRoom, setDropdownBalanceRoom] = useState([])
  const [dropdownUser, setDropdownUser] = useState([])
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
      title: 'สามารถเข้าอยู่ได้',
      dataIndex: 'effective_date',
      key: 'effective_date',
      width: 100,
    },
    {
      title: 'สถานะห้อง',
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
                  // setActionId(record.room_id)
                  
                  // let files = await getImageApi({ room_id: record.room_id })
                  // const filesData = []

                  // files?.data.map((item) => {
                  //   filesData.push({
                  //     uid: item?.file_id,
                  //     name: item?.file_name,
                  //     status: 'done',
                  //     url: `${process.env.REACT_APP_SERVICE_URL}${item.file_path}`,
                  //   })
                  // })

                  
                  // form.setFieldsValue({
                  //   room_no: record.room_no,
                  //   building_name: record.building_name,
                  //   room_type: record.room_type,
                  //   room_detail: record.room_detail,
                  //   deposit_amount: record.deposit_amount,
                  //   rental_balance: record.rental_balance,
                  //   user_id: authUser?.user?.is_admin == 0 && authUser != null ?authUser?.user?.user_id:null,
                  //   images: filesData
                  // })
                  // showModal2()
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
  const [isModal3Visible, setIsModal3Visible] = useState(false);

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
    let data = await getReservingRoomApi({ ...filters, ...filtersSearch})

    setTotal(data.total)
    setData(data)
    setLoadingPage(false)
  }

  const getDropdown = async () => {
    setLoadingPage(true)
    let dataRoom = await getDropdownRoomApi()

    let dataBuilding = await getDropdownBuildingApi()

    let dataRoomType = await getDropdownRoomTypeApi()

    let dataBalanceRoom = await getDropdownBalanceRoomApi()

    let dataUser= await getDropdownUserApi()

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
    setAuthUser(JSON.parse(localStorage.getItem('auth')))
    // setLoadingPage(false)
  }, [filters])

  return (
    <Styled className='page page-room'>
      <Spin spinning={loadingPage} tip="Loading...">
        <Card>
          <Title level={4}>Reserving Room</Title>
          <div>
        <Form
            layout="horizontal"
          // onValuesChange={onFormLayoutChange}
          >
            <Row gutter={8}>
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
                  name="building_name">
                  <Select
                    showSearch
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
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
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
          </div>
        </Card>
        
        <Card>
          <Space style={{ paddingBottom: 5 }}>
            <Button 
              icon={<InfoCircleOutlined />}
              type='primary' 
              onClick={() => { setIsModal3Visible(true) }}>
                รายอะเอียดสัญญา
            </Button>
          </Space>
          <Card>
            <Table
              columns={columns}
              dataSource={data?.items}
              scroll={{ x: 500 }}
              onRow={(record, rowIndex) => {
                return {
                  onClick: async event => {
                    setActionId(record.room_id)
                    setEffectiveDate(record.effective_date)

                    form.resetFields()

                    let files = await getImageApi({ room_id: record.room_id })
                    const filesData = []

                    files?.data.map((item) => {
                      filesData.push({
                        uid: item?.file_id,
                        name: item?.file_name,
                        status: 'done',
                        url: `${process.env.REACT_APP_SERVICE_URL}${item.file_path}`,
                      })
                    })

                    form.setFieldsValue({
                      room_no: record.room_no,
                      building_name: record.building_name,
                      room_type: record.room_type,
                      room_detail: record.room_detail,
                      deposit_amount: record.deposit_amount,
                      rental_balance: record.rental_balance,
                      reserv_stay_in_date: null,
                      user_id: authUser?.user?.is_admin == 0 && authUser != null ?authUser?.user?.user_id:null,
                      images: filesData
                    })
                    showModal2()
                  }, // click row
                };
              }}
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
          title="Reserv Room"
          onCancel={handleCancel2}
          width={"80%"}
          footer={[
            <Button key="back" onClick={handleCancel2}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={() => {
              
              form.submit()
            }}>
              จองห้อง
            </Button>,
          ]}
        >
          <Spin spinning={loadingPage} tip="Loading...">
            {contentViewModel}
            <Form
              form={form}
              onFinish={async (value) => {
                
                if(localStorage.getItem('auth') == null){
                  notification.warn({
                    message: `แจ้งเตือน`,
                    description:
                      'กรุณาเข้าสู่ระบบ กรณีคุณยังไม่มีบัญชีกรุณาลงชื่อก่อนเข้าสู่ระบบ',
                  });
                }else if(value.reserv_stay_in_date.format('YYYY-MM-DD') < effectiveDate){
                  notification.warn({
                    message: `แจ้งเตือน`,
                    description:
                      'ห้องนี้ไม่สามารถเข้าอยู่ในช่วงเวลาดังกล่าวได้',
                  });
                }else{
                  setLoadingPage(true)
                  await updateReservingRoomApi(value, actionId)
                  
                  let images = []
                  let not_del_ids = []

                  value.image_reserv.map(item => {
                    if (item.status == 'done') {
                      not_del_ids.push(item.uid)
                    } else {
                      images.push(item.originFileObj)
                    }
                  })

                  await createImageApi({reserv_bill:actionId}, [0], images)
                  handleCancel2()
                  await _list()
                }

                
              }}
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
              <Form.Item 
                label="ชื่อคนเช่า" 
                name="user_id" 
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: authUser?.user?.is_admin == 1?true:false,
                    message: 'กรุณากรอกเบอร์โทรติดต่อ',
                  },
                ]}
                >
                <Select
                  showSearch
                  style={{ width: '100%', paddingRight: 5 }}
                  placeholder="ชื่อคนเช่า"
                  disabled={authUser?.user?.is_admin == 1?false:true}
                // onChange={ async (value)=>{
                //   setActionId(value)
                // }}
                  options={authUser == null?[]:dropdownUser}
                >
                </Select>
              </Form.Item>
              <Form.Item 
                label="วันที่เข้าอยู่" 
                name="reserv_stay_in_date" 
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: authUser != null?true:false,
                    message: 'กรุณาเลือกวันที่เข้าอยู่',
                  },
                ]}
                >
                <DatePicker
                  style={{ width: '100%', paddingRight: 5 }}
                  placeholder="วันที่เข้าอยู่"
                  disabled={authUser == null?true:false}
                  disabledDate={(current) =>{
                    return moment().add(-1, 'days')  >= current ||
                      moment().add(1, 'month')  <= current;
                  }}
                // onChange={ async (value)=>{
                //   setActionId(value)
                // }}
                >
                </DatePicker>
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
                label="หลักฐานการโอนเงิน"
                name="image_reserv"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: authUser == null?false:true,
                    message: 'กรุณาใส่รูปหลักฐานการโอนเงิน',
                  },
                ]}
                >
                <MyUpload 
                  disabled={authUser == null?true:false}
                  maxCount={1} 
                />

              </Form.Item>
            </Form>
          </Spin>
        </Modal>
        <Modal title="รายละเอียดสัญญา" visible={isModal3Visible} onOk={() => { }} onCancel={() => setIsModal3Visible(false)}>
          <div>
            <p>ทุกห้องชำระ 10,000 บาท พร้อมอยู่ โดยเป็นค่าเช่า ส่วนที่เหลือถือเป็นเงินประกัน</p>
            <p>ค่าจอง 3,000 บาท ส่วนที่เหลือชำระตอนเข้าอยู่</p>
            <p><b>หมายเหตุ</b> ตอนจองกรุณาแนบหลักฐานการโอน</p>
            <p></p>
            <p><b>ธ.กสิกร 062-8365660 นาย กฤตนันท์ ตัณฑวิบูลย์วงศ์ </b></p>
          </div>
        </Modal>
      </Spin>
    </Styled>
  )
}
