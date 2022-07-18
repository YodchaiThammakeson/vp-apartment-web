import { useState } from 'react'
import { useAsync } from 'react-use'
import _ from 'lodash'
import Styled from './styled'
import {
  PlusOutlined,
  EyeOutlined
} from '@ant-design/icons'
import {
  Form,
  Card,
  Typography,
  Input,
  Row,
  Col,
  Button,
  notification,
  Spin,
  Space,
  Modal,
  Tooltip,
  Table,
  Select
} from 'antd'
import { createFeedbackApi,getFeedbackApi, updateFeedbackApi } from '../../services/feedback'

const { Title } = Typography;
export default function PageFeedBack() {

  const [form] = Form.useForm()
  const [visibleModelFeedback, setVisibleModelFeedback] = useState(false)
  const [loadingPage, setLoadingPage] = useState(false)
  const [data, setData] = useState([])
  const [total, setTotal] = useState(0)

  const [filters, setFilters] = useState({
    page: 1,
    size: 10
  })

  const columns = [
    {
      title: 'หัวข้อเรื่อง',
      dataIndex: 'feed_back_title',
      key: 'feed_back_title',
      width: '20%',
    },
    {
      title: 'ตึก',
      dataIndex: 'building_name',
      key: 'building_name',
      width: '20%',
    },
    {
      title: 'ห้อง',
      dataIndex: 'room_no',
      key: 'room_no',
      width: '10%',
    },
    {
      title: 'รายละเอียด',
      dataIndex: 'feed_back_desc',
      key: 'feed_back_desc',
      width: '40%',
    },
    {
      title: 'สถานะ',
      dataIndex: 'is_read',
      key: 'is_read',
      width: '10%',
      render: (text, record) => {return text == 1?"รับทราบแล้ว":"ยังไม่รับทราบ"}
    },
    // {
    //   title: 'Actions',
    //   dataIndex: 'actions',
    //   key: 'actions',
    //   width: '5%',
    //   render: (text, record) => {
    //     return (
    //       <Space size="small">
    //         <Tooltip title={'read'}>
    //           <Button
    //             icon={<EyeOutlined />}
    //             type="link"
    //             onClick={async () => {
    //               confirmIsRead(record.feed_back_id)
    //             }}
    //           />
    //         </Tooltip>
    //       </Space>
    //     )
    //   },
    // }
  ]

  const _list = async () => {
    setLoadingPage(true)
    let data = await getFeedbackApi({ ...filters, page: 1 })

    setData(data);
    
    setLoadingPage(false)
  }

  useAsync(async () => {
    // setLoadingPage(true)
    await _list()
    // setLoadingPage(false)
  }, [filters])

  const modelModelFeedbackCancel = () => {
    setVisibleModelFeedback(false)
  };

  const modelModelFeedbackShow = () => {
    setVisibleModelFeedback(true)
  }

  useAsync(async () => {
    form.resetFields()
  }, [])

  return (
    <Styled className='page page-feed-back'>
      <Spin spinning={loadingPage} tip="Loading...">
        <Card>
          <Title level={4}>Feedback</Title>
        </Card>
        <Card>
          <Space style={{ paddingBottom: 5 }}>
            <Button type="primary"
              icon={<PlusOutlined />}
              onClick={() => {
                modelModelFeedbackShow()
              }}
            >
              แจ้งปัญหา
            </Button>
          </Space>
          <Row>
          <Col xs={24} lg={24}>
              <Select>
                <Select.Option value={null}>ทั้งหมด</Select.Option>
                <Select.Option value={1}>ทราบแล้ว</Select.Option>
                <Select.Option value={0} disabled>ยังไม่รับทราบ</Select.Option>
              </Select>
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
            </Col>
          </Row>

        </Card>
      </Spin>
      <Modal
        title="แจ้งปัญหา"
        visible={visibleModelFeedback}
        onOk={async () => {
          form.submit()
        }}
        // confirmLoading={confirmLoading}
        onCancel={modelModelFeedbackCancel}
      >
        <Spin spinning={loadingPage} tip="Loading...">
          <Form
            form={form}
            onFinish={async (value) => {
              setLoadingPage(true)
              let res = await createFeedbackApi(value)
              if (res.status == 201) {
                notification.info({
                  message: `แจ้งเตือน`,
                  description:
                    'แจ้งปัญหาไปแล้ว',
                })
              } else {
                notification.error({
                  message: `ผิดพลาด`,
                  description:
                    'ไม่สามารถแจ้งปัญหาได้',
                })
              }

              form.resetFields()
              setVisibleModelFeedback(false)
              setLoadingPage(false)

            }}
          >

            <Form.Item
              label="หัวข้อเรื่อง"
              name="feed_back_title"
              labelCol={{ span: 6 }}
              rules={[
                {
                  required: true,
                  message: 'กรุณากรอกหัวข้อเรื่อง',
                },
              ]}
            >
              <Input placeholder='หัวข้อเรื่อง' />
            </Form.Item>
            <Form.Item
              label="ตึก"
              name="building_name"
              labelCol={{ span: 6 }}
              rules={[
                {
                  required: true,
                  message: 'กรุณากรอกชื่อตึก',
                },
              ]}
            >
              <Input placeholder='ตึก' />
            </Form.Item>
            <Form.Item
              label="ห้อง"
              name="room_no"
              labelCol={{ span: 6 }}
              rules={[
                {
                  required: true,
                  message: 'กรุณากรอกเลขห้อง',
                },
              ]}
            >
              <Input placeholder='ห้อง' />
            </Form.Item>
            <Form.Item
              label="รายละเอียด"
              name="feed_back_desc"
              labelCol={{ span: 6 }}
              rules={[
                {
                  required: true,
                  message: 'กรุณากรอกรายละเอียด',
                },
              ]}
            >
              <Input.TextArea rows={5} placeholder='รายละเอียด' />
            </Form.Item>
          </Form>
        </Spin>
      </Modal>
    </Styled>
  )
}
