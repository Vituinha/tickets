import { useContext, useState } from 'react'
import Header from '../../components/Header'
import Tittle from '../../components/Tittle'

import { FiSettings, FiUpload } from 'react-icons/fi'
import avatar from '../../assets/avatar.png'
import {AuthContext} from '../../contexts/auth'

import { toast } from 'react-toastify'

import { db, storage } from '../../services/firebaseConnection'
import { doc, updateDoc } from 'firebase/firestore'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import './profile.css';

export default function Profile(){

    const { user, setUser, storageUser, logout } = useContext(AuthContext);
    const [nome, setNome] = useState(user && user.nome)
    const [email, setEmail] = useState(user && user.email)
    const [avatarUrl, setAvatarUrl] = useState(user && user.avatarUrl)
    const [imageAvatar, setImageAvatar] = useState(null)
    
    function handleFile(e){
        if(e.target.files[0])
        {
            const image = e.target.files[0]

            if(image.type === 'image/jpeg' || image.type === 'image/png')
            {
                setImageAvatar(image)
                setAvatarUrl(URL.createObjectURL(image))
            }
            else{
                alert("Envie uma imagem do tipo PNG ou JPEG")
                setImageAvatar(null)
                return
            }
        }
    }

    async function handleUpload(){
        const currentUid = user.uid

        const uploadRef = ref(storage, `images/${currentUid}/${imageAvatar.name}`)
        const uploadTask = uploadBytes(uploadRef, imageAvatar)
        .then((snapshot) => {
            getDownloadURL(snapshot.ref).then( async (downloadURL) => {
                let urlFoto = downloadURL

                const docRef = doc(db, "users", user.uid)
                await updateDoc(docRef, {
                    avatarUrl: urlFoto,
                    nome: nome
                })
                .then(() => {
                    let data = {
                        ...user,
                        nome: nome,
                        avatarUrl: urlFoto
                    }
    
                    setUser(data)
                    storageUser(data)
                })
            })
            toast.success("Imagem salva com sucesso!")
        })
    }

    async function handleSubmit(e){
        e.preventDefault()

        if(imageAvatar === null && nome !== ''){
            const docRef = doc(db, "users", user.uid)
            await updateDoc(docRef, {
                nome: nome
            })
            .then(() => {
                let data = {
                    ...user,
                    nome: nome
                }

                setUser(data)
                storageUser(data)
                toast.success("Atualizado com sucesso!")
            })
        }else if(nome !== '' && imageAvatar !== null){
            handleUpload()
        }
    }

  return(
    <div>
      <Header/>

      <div className="content">
        <Tittle name="Minha conta">
          <FiSettings size={25} />
        </Tittle>

       <div className="container">

        <form className="form-profile" onSubmit={handleSubmit}>
          <label className="label-avatar">
            <span>
              <FiUpload color="#FFF" size={25} />
            </span>

            <input type="file" accept="image/*" onChange={handleFile}/> <br/>
            {avatarUrl === null ? (
              <img src={avatar} alt="Foto de perfil" width={250} height={250} />
            ) : (
              <img src={avatarUrl} alt="Foto de perfil" width={250} height={250} />
            )}

          </label>

          <label>Nome</label>
          <input type="text" placeholder="Seu nome" value={nome} onChange={(e) => setNome(e.target.value)}/>

          <label>Email</label>
          <input type="text" placeholder="teste@teste.com" disabled={true} value={email}/>
          
          <button type="submit">Salvar</button>
        </form>

       </div>

       <div className="container">
         <button className="logout-btn" onClick={() => logout()}>Sair</button>
       </div>

      </div>

    </div>
  )
}