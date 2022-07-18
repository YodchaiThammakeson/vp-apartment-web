import { useState } from 'react'
import { useAsync } from 'react-use'
import _ from 'lodash'
import Styled from './styled'
import {
  Form,
  Card,
  Typography,
  Input,
  Row,
  Col,
  Button,
  Space,
  Tooltip,
  Table,
  Spin,
  Modal,
  Select
} from 'antd'

import {
  EyeOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { getFeedbackApi, updateFeedbackApi } from '../../services/feedback'


const { Title } = Typography;
export default function PageFeedBackAdmin() {

  const [data, setData] = useState([])
  const [loadingPage, setLoadingPage] = useState(true)
  const [total, setTotal] = useState(0)

  const [filters, setFilters] = useState({
    page: 1,
    size: 10,
    is_read: 'all'
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
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      width: '5%',
      render: (text, record) => {
        return (
          <Space size="small">
            <Tooltip title={'read'}>
              <Button
                icon={<EyeOutlined />}
                type="link"
                onClick={async () => {
                  confirmIsRead(record.feed_back_id)
                }}
              />
            </Tooltip>
          </Space>
        )
      },
    }
  ]

  const confirmIsRead = (id) => {
    Modal.confirm({
      title: "Confirm",
      icon: <ExclamationCircleOutlined />,
      content: "คุณได้อ่านข้อความนี้แล้ว",
      okText: "Confirm",
      cancelText: "Cancel",
      onOk: async () => {
        await updateFeedbackApi({is_read:1},id)
        await _list()
      }
    });
  }

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

  return (
    <Styled className='page page-feed-back-admin'>
      <Spin spinning={loadingPage} tip="Loading...">
        <Card>
          <Title level={4}>Feedback</Title>
        </Card>
        <Card>
          <Row>
            <Col xs={24} lg={24}>
              <div style={{textAlign: 'end',marginBottom: '5px'}}>
                <Select 
                  defaultValue='all'
                  style={{ width: '10%',textAlign: 'left'}}
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      is_read: value
                    })
                  }}
                  >
                  <Select.Option value='all' select>ทั้งหมด</Select.Option>
                  <Select.Option value='1'>รับทราบแล้ว</Select.Option>
                  <Select.Option value='0'>ยังไม่รับทราบ</Select.Option>
                </Select>
              </div>
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
    </Styled>
  )
}
