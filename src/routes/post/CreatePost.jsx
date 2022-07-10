import React, { useState } from 'react'
import { useOutletContext, useNavigate } from 'react-router-dom'
import EditArea from '../../components/EditArea.jsx'

export default function CreatePost() {

  let user = useOutletContext()

  if (user) {
    return (
    <EditArea />
    )
  } else {
    return <div>Log in to create at post </div>
  }
}
