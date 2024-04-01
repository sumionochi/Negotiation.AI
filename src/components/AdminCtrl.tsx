import React from 'react'
import InviteUser from './InviteUser'
import DeleteChatBtn from './DeleteChatBtn'

type Props = {
    chatId: string
}

const AdminCtrl = ({chatId}: Props) => {
  return (
    <div className='flex flex-col sm:flex-row max-sm:gap-4 justify-end sm:space-x-2 m-5 mb-0'>
        <InviteUser chatId={chatId}/>
        <DeleteChatBtn chatId={chatId}/>
    </div>
  )
}

export default AdminCtrl