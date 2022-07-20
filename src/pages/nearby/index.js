import { useState } from 'react'
import { useAsync } from 'react-use'
import _ from 'lodash'
import Styled from './styled'
import 'antd/dist/antd.css'
import './styled.css'
import MyUpload from '../../components/Upload'
import {
  Descriptions,
  Card,
  Typography,
  Input,
  Form,
  Row,
  Col,
  DatePicker,
  Button,
  Space,
  Spin,
  Modal,
  Select,
  Upload,
} from 'antd'
import {
  DeleteOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import {
  createImageApi,
  getImageApi
} from '../../services/image'
import {
  getNearbyLocationApi,
  createNearbyLocationApi,
  updateNearbyLocationApi,
  deleteNearbyLocationApi
} from '../../services/nearby_location';

const { Title, Text } = Typography;
const { Option } = Select;
const { Meta } = Card;
const { TextArea } = Input;

export default function PageNearbyLocation() {
  const [data, setData] = useState({ data: [] })
  const [form] = Form.useForm()
  const [actionId, setActionId] = useState(null)
  const [actionData, setActionData] = useState(null)
  const [loadingPage, setLoadingPage] = useState(true)
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('auth')))

  const _list = async () => {
    setLoadingPage(true)
    let data = await getNearbyLocationApi()

    setData(data)
    setLoadingPage(false)
  }

  const renderDataSourceItem = (data) => {
    let imageUrl = data.file_id == null ?
      "https://os.alipayobjects.com/rmsportal/QBnOOoLaAfKPirc.png" :
      `${process.env.REACT_APP_SERVICE_URL}${data.file_path}`;
    return (
      <div className="space-align-block">
        <Space align="center">
          <Card
            hoverable
            onClick={() => {
              if (authUser != null && authUser?.user.is_admin == 1) {
                setActionId(data.location_id)
                setActionData(data)

                const filesData = []
                if (data.file_id != null) {
                  filesData.push({
                    uid: data?.file_id,
                    name: data?.file_name,
                    status: 'done',
                    url: `${process.env.REACT_APP_SERVICE_URL}${data.file_path}`,
                  })
                }

                form.setFieldsValue({
                  location_name: data.location_name,
                  location_detail: data.location_detail,
                  map: data.map,
                  images: filesData
                })
                showModal()
              }
              
            }}
            cover={<img className='responsive-img' style={{ height: '250px' }} alt="example" src={imageUrl} />}
          >
            <Descriptions title={data.location_name}>
              <Descriptions.Item style={{ height: "100px" }} label="รายละเอียด">
                <Text>{data.location_detail}</Text>
              </Descriptions.Item>
            </Descriptions>
            <Descriptions>
              <Descriptions.Item style={{ height: "150px" }} label="Google map"><a href={data.map} rel="noreferrer" target="_blank">{data.map}</a></Descriptions.Item>
            </Descriptions>

          </Card>
        </Space>
      </div>
    )
  }

  const renderDataSource = () => {

    return (
      <div className="space-align-container">
        {
          data.data.map(item => {
            return renderDataSourceItem(item)
          })
        }
      </div>
    )
  }

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => {
    setIsModalVisible(true);
  };

  const confirmDelete = () => {
    Modal.confirm({
      title: "Delete",
      icon: <ExclamationCircleOutlined />,
      content: "คุณต้องการลบข้อมูลนี้ใช่หรือไม่",
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        await deleteNearbyLocationApi(actionId)
        setIsModalVisible(false)
        _list()
      }
    });
  }

  useAsync(async () => {
    // setLoadingPage(true)
    await _list()
    setAuthUser(JSON.parse(localStorage.getItem('auth')))
    // setLoadingPage(false)
  }, [])

  return (
    <Styled className='page page-other-service'>
      <Spin spinning={loadingPage} tip="Loading...">
        <Card>
          <Title level={4}>Nearby Location</Title>
          <Form
            layout="horizontal"
          // onValuesChange={onFormLayoutChange}
          >
            <Row>

            </Row>
          </Form>
        </Card>
        <Card>
          <Space style={{ paddingBottom: 5 }}>
            <Button
              type='primary'
              icon={<PlusOutlined/>}
              disabled={authUser != null && authUser?.user.is_admin == 1 ? false : true}
              onClick={() => {
                form.resetFields()
                setActionId(null)
                setActionData(null)
                showModal()
              }}>
              Add Location
            </Button>
          </Space>
          <Card>
            {renderDataSource()}
          </Card>
        </Card>
        <Modal
          title="Add/Update Room"
          visible={isModalVisible}
          // onOk={async () => {
          //   form.submit()
          // }}
          onCancel={() => setIsModalVisible(false)}
          footer={[
            <Button key="submit" type="danger" onClick={() => { confirmDelete() }} disabled={actionId == null ? true : false}>
              Delete
            </Button>,
            <Button key="back" onClick={() => setIsModalVisible(false)}>
              Cancel
            </Button>,
            <Button key="submit" type="primary" onClick={async () => {
              form.submit()
            }}>
              OK
            </Button>,
          ]}
        >
          <Spin spinning={loadingPage} tip="Loading...">
            <Form
              form={form}
              onFinish={async (value) => {
                setLoadingPage(true)
                let location_id = null
                if (actionId == null) {
                  let newItem = await createNearbyLocationApi(value)
                  location_id = newItem.location_id
                } else {
                  await updateNearbyLocationApi(value, actionId)
                  location_id = actionId
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

                await createImageApi({ location_id: location_id }, [0], images)

                setIsModalVisible(false)
                _list()

              }}
            >
              <Form.Item
                label="ชื่อสถานที่"
                name="location_name"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกชื่อสถานที่',
                  },
                ]}
                >
                <Input placeholder="ชื่อสถานที่" />
              </Form.Item>
              <Form.Item
                label="รายเอียดละเอียด"
                name="location_detail"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกรายเอียดละเอียดสถานที่',
                  },
                ]}
                >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                label="Google map"
                name="map"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกพิกัดสถานที่',
                  },
                ]}
                >
                <TextArea rows={2} />
              </Form.Item>
              <Form.Item
                label="รูปภาพ"
                name="images"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณาใส่รูปภาพ',
                  },
                ]}
                >
                <MyUpload
                  maxCount={1}
                />
              </Form.Item>
            </Form>
          </Spin>
        </Modal>
      </Spin>
    </Styled>
  )
}
