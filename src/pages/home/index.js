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
  InputNumber,
  Spin,
  Image
} from 'antd'
import {
  DeleteOutlined,
  SettingOutlined,
  ExclamationCircleOutlined,
} from '@ant-design/icons'
import moment from 'moment'
import { ExportBillApi } from '../../services/export'
import {
  getElectricityBillApi,
  createElectricityBillApi,
  updateElectricityBillApi,
  deleteElectricityBillApi
}
  from '../../services/electricity_bill'
import { getDropdownRoomApi, getDropdownBuildingApi } from '../../services/filter'
import LineImage from '../../images/qr_code_line.jpg'
import KBank from '../../images/k_bank.jpg'
import Hor1 from '../../images/รูปหอ1.jpg'
import Hor2 from '../../images/รูปหอ2.jpg'
import Hor3 from '../../images/รูปหอ3.jpg'

const { Title } = Typography;
const { Option } = Select;


export default function PageHome() {


  return (
    <Styled className='page page-home'>
      <div className="site-card-border-less-wrapper">
        <Card title="VP Rangsit Apartment" bordered={false} style={{ width: '100%' }}>
          <div style={{textAlign:'center'}}>
            <Image src={Hor1} width={300} height={200}></Image>
            <Image src={Hor2} width={300} height={200}></Image>
            <Image src={Hor3} width={300} height={200}></Image>
          </div>
          <div style={{textAlign:'center'}}>
            <p>สอบถามรายละเอียดเพิ่มเติม หรือ แจ้งการชำระต่างๆ โทร</p>
            <p>089-144-3441 หรือ 092-945-5352</p>
            <p>LINE QR Code</p>
            <Image src={LineImage} width={300} height={200}></Image>
            <p>Facebook Page</p>
            <p>VP Apartment</p>
            <a href='https://www.facebook.com/vpapartmentrangsit' target='_blank'>FaceBook VP Apartmentrangsit</a>
            <p>โอนเงินการจอง หรือ ชำระน้ำ-ไฟ</p>
            <p>ธ.กสิกร 062-8-36566-0 นาย กฤตนันท์ ตัณฑวิบูลย์วงศ์</p>
            <Image src={KBank} width={300} height={200}></Image>
          </div>
        </Card>
      </div>,
    </Styled>
  )
}
