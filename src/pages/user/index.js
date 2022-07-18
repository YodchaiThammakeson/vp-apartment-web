import { useState } from 'react'
import { useAsync } from 'react-use'
import _ from 'lodash'
import Styled from './styled'
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
  SettingOutlined,
  ExclamationCircleOutlined,
  ExportOutlined
} from '@ant-design/icons'
import {
  getDropdownRoomApi,
  getDropdownUserApi
} from '../../services/filter'
import { getUserApi, updateUserApi } from '../../services/user'
import { ExportReservBillApi } from '../../services/export'
const { Title } = Typography;
const { Option } = Select;

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


export default function PageUser() {
  const [visibleModelCreate, setVisibleModelCreate] = useState(false)
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

  const [nameOfButtonSubmit, setNameOfButtonSubmit] = useState('Submit')

  const [dropdownRoomNo, setDropdownRoomNo] = useState([])
  const [dropdownUser, setDropdownUser] = useState([])


  const columns = [
    {
      title: 'ชื่อ-นามสกุล',
      dataIndex: 'user_full_name',
      key: 'user_full_name',
      width: '30%',
    },
    {
      title: 'เช่าห้อง',
      dataIndex: 'room_no',
      key: 'room_no',
      width: '10%',
    },

    {
      title: 'ตึก',
      dataIndex: 'building_name',
      key: 'building_name',
      width: '10%',
    },
    {
      title: 'เบอร์ติดต่อ',
      dataIndex: 'tel_number',
      key: 'tel_number',
      width: '10%',
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: '5%',
      render: (text, record) => {
        return (
          <Space size="small">
            <Tooltip title={'ใบจอง'}>
              <Button
                type="link"
                icon={<ExportOutlined />}
                onClick={async () => {
                 await ExportReservBillApi({room_id: record.room_id})
                }}
              />
            </Tooltip>
            <Tooltip title={'Edit'}>
              <Button
                type="link"
                icon={<SettingOutlined />}
                onClick={async () => {
                  setActionId(record.user_id)
                  form.setFieldsValue({
                    user_full_name: record.user_full_name,
                    id_card_number: record.id_card_number,
                    email: record.email,
                    tel_number: record.tel_number
                  })
                  setVisibleModelCreate(true)
                }}
              />
            </Tooltip>
            {/* <Tooltip title={'Delete'}>
              <Button
                type="link"
                danger
                icon={<DeleteOutlined />}
                onClick={() => {
                  confirmDelete()
                }}
              />
            </Tooltip> */}
          </Space>
        )
      },
    }
  ];

  const modelCreateCancel = () => {
    setVisibleModelCreate(false)
  };

  const modelCreateShow = () => {
    setVisibleModelCreate(true)
  }



  const _list = async () => {
    setLoadingPage(true)
    let data = await getUserApi({ ...filters, ...filtersSearch, page: 1 })

    setTotal(data.total)
    setData(data)
    setLoadingPage(false)
  }

  const getDropdown = async () => {
    setLoadingPage(true)
    let dataRoom = await getDropdownRoomApi()

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
    <Styled className='page page-user-detail'>
      <Spin spinning={loadingPage} tip="Loading...">
        <Card>
          <Title level={4}>User</Title>
          <Form
            layout="horizontal"
          // onValuesChange={onFormLayoutChange}
          >
            <Row>
              <Col xs={24} lg={8} style={{ paddingRight: 5 }}>
                <Form.Item label="เลขห้อง" name='room_id'>
                  <Select
                    mode="multiple"
                    // allowClear
                    style={{ width: '100%' }}
                    placeholder="เลขห้อง"
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        room_id: value
                      })
                    }}
                    options={dropdownRoomNo}
                  // defaultValue={['a10', 'c12']}
                  // onChange={handleChange}
                  >
                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={8} style={{ paddingRight: 5 }}>
                <Form.Item label="ชื่อ-นามสกุล">
                  <Select
                    mode="multiple"
                    style={{ width: '100%', paddingRight: 5 }}
                    placeholder="ชื่อคนเช่า"
                    onChange={(value) => {
                      setFiltersSearch({
                        ...filtersSearch,
                        user_id: value
                      })
                    }}
                    options={dropdownUser}
                  >

                  </Select>
                </Form.Item>
              </Col>
              <Col xs={24} lg={8} style={{ paddingRight: 5 }}>
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
            {/* <Button type="primary" onClick={modelCreateShow}>Create</Button> */}
          </Space>
          <Form>
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
          </Form>
        </Card>

        <Modal
          title="Create"
          visible={visibleModelCreate}
          onOk={async () => {
            form.submit()
          }}
          // confirmLoading={confirmLoading}
          onCancel={modelCreateCancel}
        >
          <Spin spinning={loadingPage} tip="Loading...">
            <Form
              form={form}
              onFinish={async (value) => {
                setLoadingPage(true)
                if (actionId != null) {
                  await updateUserApi(value, actionId)
                }
                modelCreateCancel()
                await _list()
              }}
            >
              <Form.Item 
                name='user_full_name' 
                label="ชื่อ-นามสกุล" 
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกชื่อ-นามสกุล',
                  },
                ]}
                >
                <Input placeholder='ชื่อ-นามสกุล' />
              </Form.Item>
              <Form.Item 
                name='id_card_number' 
                label="เลขบัตรประชาชน" 
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกเลขบัตรประชาชน',
                  },
                ]}
                >
                <Input showCount maxLength={13} placeholder='เลขบัตรประชาชน' />
              </Form.Item>
              <Form.Item 
                name='email' 
                label="E-mail" 
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอก E-mail',
                  },
                ]}
                >
                <Input placeholder='E-mail' />
              </Form.Item>
              <Form.Item 
                name='tel_number' 
                label="เบอร์โทรติดต่อ" 
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกเบอร์โทรติดต่อ',
                  },
                ]}
                >
                <Input placeholder='เบอร์โทรติดต่อ' />
              </Form.Item>
            </Form>
          </Spin>
        </Modal>
      </Spin>
    </Styled>
  )
}
