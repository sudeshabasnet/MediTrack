import { Modal } from 'antd'
import { ExclamationCircleOutlined, DeleteOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'

// Common modal styles
const modalStyles = {
  content: {
    borderRadius: '16px',
    padding: 0,
  },
  header: {
    borderRadius: '16px 16px 0 0',
    padding: '24px 24px 16px',
  },
  body: {
    padding: '24px',
  },
  footer: {
    padding: '16px 24px 24px',
    marginTop: 0,
  }
}

// Beautiful confirm dialog with custom styling
export const showConfirmModal = ({
  title,
  content,
  onOk,
  onCancel,
  okText = 'Confirm',
  cancelText = 'Cancel',
  icon = <ExclamationCircleOutlined />,
  okButtonProps = {},
  type = 'warning', // warning, danger, success, info
}) => {
  const colors = {
    warning: {
      icon: '#faad14',
      okButton: '#faad14',
      okType: 'primary',
    },
    danger: {
      icon: '#ff4d4f',
      okButton: '#ff4d4f',
      okType: 'primary',
    },
    success: {
      icon: '#52c41a',
      okButton: '#52c41a',
      okType: 'primary',
    },
    info: {
      icon: '#1890ff',
      okButton: '#1890ff',
      okType: 'primary',
    }
  }

  const config = colors[type] || colors.warning

  return Modal.confirm({
    title: (
      <div style={{ 
        fontSize: '18px', 
        fontWeight: 600,
        color: '#262626',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ color: config.icon, fontSize: '24px' }}>
          {icon}
        </span>
        {title}
      </div>
    ),
    content: (
      <div style={{ 
        marginLeft: '36px',
        marginTop: '16px',
        fontSize: '14px',
        color: '#595959',
        lineHeight: '1.6'
      }}>
        {content}
      </div>
    ),
    icon: null,
    okText,
    cancelText,
    centered: true,
    okType: config.okType,
    okButtonProps: {
      size: 'large',
      style: {
        borderRadius: '8px',
        height: '40px',
        fontWeight: 500,
        backgroundColor: config.okButton,
        borderColor: config.okButton,
        ...okButtonProps.style
      },
      ...okButtonProps
    },
    cancelButtonProps: {
      size: 'large',
      style: {
        borderRadius: '8px',
        height: '40px',
        fontWeight: 500,
      }
    },
    width: 480,
    styles: modalStyles,
    onOk,
    onCancel,
  })
}

// Delete confirmation modal
export const showDeleteConfirm = ({
  title = 'Delete Item?',
  itemName = 'this item',
  additionalWarning = null,
  onConfirm,
}) => {
  return showConfirmModal({
    title,
    content: (
      <div>
        <p style={{ marginBottom: '12px', fontSize: '15px' }}>
          <strong>This action cannot be undone.</strong>
        </p>
        <p style={{ marginBottom: additionalWarning ? '12px' : '0' }}>
          {`Are you sure you want to delete ${itemName}? This will permanently remove it from the system.`}
        </p>
        {additionalWarning && (
          <div style={{ 
            marginTop: '16px',
            padding: '12px 16px',
            background: '#fff7e6',
            border: '1px solid #ffd591',
            borderRadius: '8px',
            color: '#d46b08',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <ExclamationCircleOutlined style={{ marginTop: '2px', fontSize: '16px' }} />
            <span style={{ flex: 1 }}>{additionalWarning}</span>
          </div>
        )}
      </div>
    ),
    okText: 'Yes, Delete',
    cancelText: 'No, Cancel',
    icon: <DeleteOutlined />,
    type: 'danger',
    onOk: onConfirm,
  })
}

// Status change confirmation modal
export const showStatusChangeConfirm = ({
  title = 'Confirm Status Change',
  currentStatus,
  newStatus,
  additionalInfo = null,
  warningMessage = null,
  onConfirm,
}) => {
  return showConfirmModal({
    title,
    content: (
      <div>
        <p style={{ marginBottom: '12px' }}>
          <strong>This action cannot be undone!</strong>
        </p>
        <p style={{ marginBottom: '16px' }}>
          You are about to change the status to:{' '}
          <span style={{
            display: 'inline-block',
            padding: '4px 12px',
            background: '#e6f7ff',
            color: '#1890ff',
            borderRadius: '6px',
            fontWeight: 600,
            fontSize: '14px',
            marginTop: '8px'
          }}>
            {newStatus}
          </span>
        </p>
        {additionalInfo && (
          <p style={{ marginBottom: warningMessage ? '12px' : '0', color: '#595959' }}>
            {additionalInfo}
          </p>
        )}
        {warningMessage && (
          <div style={{ 
            marginTop: '16px',
            padding: '12px 16px',
            background: '#fff1f0',
            border: '1px solid #ffccc7',
            borderRadius: '8px',
            color: '#cf1322',
            fontWeight: 500,
            display: 'flex',
            alignItems: 'flex-start',
            gap: '8px'
          }}>
            <ExclamationCircleOutlined style={{ marginTop: '2px', fontSize: '16px' }} />
            <span style={{ flex: 1 }}>{warningMessage}</span>
          </div>
        )}
      </div>
    ),
    okText: 'Yes, Update Status',
    cancelText: 'No, Cancel',
    icon: <ExclamationCircleOutlined />,
    type: 'warning',
    onOk: onConfirm,
  })
}

// Success confirmation modal
export const showSuccessConfirm = ({
  title = 'Success',
  content,
  onOk,
}) => {
  return showConfirmModal({
    title,
    content,
    okText: 'OK',
    cancelText: null,
    icon: <CheckCircleOutlined />,
    type: 'success',
    onOk,
  })
}

// Info confirmation modal
export const showInfoConfirm = ({
  title = 'Information',
  content,
  onOk,
  onCancel,
  okText = 'OK',
  cancelText = 'Cancel',
}) => {
  return showConfirmModal({
    title,
    content,
    okText,
    cancelText,
    icon: <InfoCircleOutlined />,
    type: 'info',
    onOk,
    onCancel,
  })
}






