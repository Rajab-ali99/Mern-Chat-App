 const url= `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_REACT_APP_CLOUDINARY_CLOUD_NAME}/auto/upload`
 const uploadFile= async (file)=>{
     const formdata= new FormData()
     formdata.append('file', file)
     formdata.append('upload_preset','chat-app-file')
     const response= await fetch (url,
        {
            method:'post',
            body: formdata
        })
    const responseData = await response.json()
    return responseData
 }
 export default uploadFile