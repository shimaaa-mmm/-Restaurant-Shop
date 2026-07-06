import { message } from 'antd'

message.config({ top: 90, duration: 2.2, maxCount: 3 })

export const notify = {
  success: (content) => message.success(content),
  error: (content) => message.error(content),
  info: (content) => message.info(content),
  warning: (content) => message.warning(content),
}
