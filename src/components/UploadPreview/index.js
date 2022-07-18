import React, { useState } from 'react'
import { Upload, Modal } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
import _ from 'lodash'
import './styled.css'
import { getBase64FromFile } from '../../utils'

export default function MyUploadPreview({
  value,
  onChange = () => null,
  maxCount = null,
  multiple = false,
  disabled = false,
  file,
}) {
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')
  const [previewTitle, setPreviewTitle] = useState('')
  const fileList = file
    ? _.compact(_.isArray(file) ? file : [file])
    : _.compact(_.isArray(value) ? value : [value])

  return (
    <>
    
      <Upload
        name="logo"
        className='upload-preview'
        disabled={disabled}
        multiple={multiple}
        maxCount={maxCount}
        listType="picture-card"
        fileList={fileList}
        showUploadList={{
          showDownloadIcon: true,
          showRemoveIcon: false,
          showPreviewIcon: true,
        }}
        beforeUpload={() => {
          return false
        }}
        onChange={({ fileList: items }) => {
          onChange(items)
        }}
        onPreview={async (f) => {
          const file = f

          if (!file.url && !file.preview) {
            file.preview = await getBase64FromFile(file.originFileObj)
          }

          setPreviewImage(file.url || file.preview)
          setPreviewTitle(file.name || file.url.substring(file.url.lastIndexOf('/') + 1))
          setPreviewVisible(true)
        }}
        onDownload={async (f) => {
          const file = f
          const link = document.createElement('a')
          link.href = file.url
          link.target = '_blank'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        }}
      >
        {/* <div>
          <PlusOutlined />
          <div style={{ marginTop: 8 }}>Upload</div>
        </div> */}
      </Upload>

      <Modal
        centered
        visible={previewVisible}
        title={previewTitle}
        footer={null}
        width={'50%'}
        style={{height:'500px',verticalAlign:'top',paddingTop:10}}
        onCancel={() => {
          setPreviewVisible(false)
        }}
      >
        <img src={previewImage} alt="" style={{ width: '100%' }} />
      </Modal>
    </>
  )
}
