import { useState } from 'react'
import { useAsync } from 'react-use'
import _ from 'lodash'
import Styled from './styled'
import 'antd/dist/antd.css';
import './styled.css'
import MyUpload from '../../components/Upload';
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
} from 'antd'
import {
  DeleteOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
  PlusOutlined
} from '@ant-design/icons'
import {
  getOtherServiceApi,
  createOtherServiceApi,
  updateOtherServiceApi,
  deleteOtherServiceApi
} from '../../services/other_service'
import {
  createImageApi,
  getImageApi
} from '../../services/image'
const { Title, Text } = Typography;
const { Option } = Select;
const { Meta } = Card;
const { TextArea } = Input;

export default function PageOtherService() {
  const [data, setData] = useState({ data: [] })
  const [form] = Form.useForm()
  const [actionId, setActionId] = useState(null)
  const [actionData, setActionData] = useState(null)
  const [loadingPage, setLoadingPage] = useState(true)
  const [authUser, setAuthUser] = useState(JSON.parse(localStorage.getItem('auth')))

  const _list = async () => {
    setLoadingPage(true)
    let data = await getOtherServiceApi()

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
                setActionId(data.other_service_id)
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
                  other_service_name: data.other_service_name,
                  other_serivce_desc: data.other_serivce_desc,
                  other_service_localtion: data.other_service_localtion,
                  service_fee: data.service_fee,
                  other_service_unit: data.other_service_unit,
                  images: filesData
                })
                showModal()
              }

            }}
            cover={<img style={{ height: '250px' }} alt="example" src={imageUrl} />}
          >
            <Descriptions title={data.other_service_name}>
              <Descriptions.Item style={{height:'80px'}} label="รายละเอียด">
                {data.other_serivce_desc}
              </Descriptions.Item>
            </Descriptions>
            <Descriptions>
              <Descriptions.Item label="สถานที่">{data.other_service_localtion}</Descriptions.Item>
            </Descriptions>
            <Descriptions>
              <Descriptions.Item label="ราคา">{`${data.service_fee} ${data.other_service_unit}`}</Descriptions.Item>
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
        await deleteOtherServiceApi(actionId)
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
          <Title level={4}>Other Service</Title>
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
              Add Other Service
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
                let other_service_id = null
                if (actionId == null) {
                  let newItem = await createOtherServiceApi(value)
                  other_service_id = newItem.other_service_id
                } else {
                  await updateOtherServiceApi(value, actionId)
                  other_service_id = actionId
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

                await createImageApi({ other_service_id: other_service_id }, [0], images)

                setIsModalVisible(false)
                _list()

              }}
            >

              <Form.Item
                label="ชื่อบริการ"
                name="other_service_name"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกชื่อบริการ',
                  },
                ]}
                >
                <Input placeholder="ชื่อบริการ" />
              </Form.Item>
              <Form.Item
                label="รายเอียดละเอียด"
                name="other_serivce_desc"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกรายเอียดละเอียดบริการ',
                  },
                ]}
                >
                <TextArea rows={4} />
              </Form.Item>
              <Form.Item
                label="สถานที่"
                name="other_service_localtion"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกสถานที่',
                  },
                ]}
                >
                <TextArea rows={2} />
              </Form.Item>
              <Form.Item
                label="ค่าบริการ"
                name="service_fee"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกค่าบริการ',
                  },
                ]}
                >
                <Input placeholder="ค่าบริการ" />
              </Form.Item>
              <Form.Item
                label="หน่วยค่าบริการ"
                name="other_service_unit"
                labelCol={{ span: 6 }}
                rules={[
                  {
                    required: true,
                    message: 'กรุณากรอกหน่วยค่าบริการ',
                  },
                ]}
                >
                <Input placeholder="หน่วยค่าบริการ" />
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
      </Spin >
    </Styled >
  )
}
