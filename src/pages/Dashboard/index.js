import { useContext, useEffect, useState } from 'react'
import { AuthContext } from '../../contexts/auth'

import { db } from '../../services/firebaseConnection'
import { collection, getDocs, orderBy, limit, startAfter, query } from 'firebase/firestore'

import { Link } from 'react-router-dom'

import Header from '../../components/Header'
import Tittle from '../../components/Tittle'

import { format } from 'date-fns'

import './dashboard.css'
import { FiEdit2, FiMessageSquare, FiPlus, FiSearch } from 'react-icons/fi'
import Modal from '../../components/Modal'

const listRef = collection(db, "chamados")

export default function Dashboard(){
  const { logout } = useContext(AuthContext)

  const [chamados, setChamados] = useState([])
  const [loading, setLoading] = useState(true)
  const [isEmpty, setIsEmpty] = useState(false)

  const [lastDocs, setLastDocs] = useState()
  const [loadingMore, setLoadingMore] = useState(false)

  const [showPostModal, setShowPostModal] = useState(false)
  const [detail, setDetail] = useState({})

  useEffect(() => {
    async function loadChamados(){
      const q = query(listRef, orderBy('created', 'desc'), limit(5))
      const querySnapshot = await getDocs(q)
      setChamados([])
      await updateState(querySnapshot)

      setLoading(false)
    }
    loadChamados()
  }, [])

  async function updateState(querySnapshot){
    const isCollectionEmpty = querySnapshot.size === 0

    if(!isCollectionEmpty){
      let lista = []

      querySnapshot.forEach((doc) => {
        lista.push({
          id: doc.id,
          assunto: doc.data().assunto,
          cliente: doc.data().cliente,
          clienteId: doc.data().clienteId,
          created: doc.data().created,
          status: doc.data().status,
          createdFormat: format(doc.data().created.toDate(), 'dd/MM/yyyy'),
          complemento: doc.data().complemento
        })
      })
      const lastDoc = querySnapshot.docs[querySnapshot.docs.length - 1]
      setChamados(chamados => [...chamados, ...lista])
      setLastDocs(lastDoc)
    }else{
      setIsEmpty(true)
    }

    setLoadingMore(false)
  }

  async function handleMore(){
    setLoadingMore(true)
    const q = query(listRef, orderBy('created', 'desc'), startAfter(lastDocs), limit(5))
    const querySnapshot = await getDocs(q)
    await updateState(querySnapshot)
  }

  function toggleModal(item){
    setShowPostModal(!showPostModal)
    setDetail(item)
  }

  if(loading){
    return(
      <div>
        <Header/>
        <div className='content'>
          <Tittle name='Tickets'>
            <FiMessageSquare size={25} />
          </Tittle>

          <div className='container dashboard'>
            <span>Buscando chamados...</span>
          </div>
        </div>
      </div>
    )
  }

  return(
    <div>
      <Header/>
      
      <div className='content'>
        <Tittle name='Tickets'>
          <FiMessageSquare size={25} />
        </Tittle>

        <>

          {
          chamados.length === 0 ? (
            <div className='container dashboard'>
              <span>Nenhum chamado encontrado...</span>
              <Link to='/new' className='new'>
                <FiPlus size={25} color='#FFF'/>
                Novo Chamado
              </Link>
            </div>
          ) : (
            <>
              <Link to='/new' className='new'>
                <FiPlus size={25} color='#FFF'/>
                Novo Chamado
              </Link>
              <table>
                <thead>
                  <tr>
                    <th scope='col'>Cliente</th>
                    <th scope='col'>Assunto</th>
                    <th scope='col'>Status</th>
                    <th scope='col'>Cadastrado em</th>
                    <th scope='col'>#</th>
                  </tr>
                </thead>
                <tbody>
                  {chamados.map((item, index) => {
                    return(
                      <tr key={index}>
                        <td data-label="Cliente">{item.cliente}</td>
                        <td data-label="Assunto">{item.assunto}</td>
                        <td data-label="Status">
                          <span className='badge' style={{backgroundColor: item.status === 'Aberto' ? '#5CB85C' : '#999'}}>
                            {item.status}
                          </span>
                        </td>
                        <td data-label="Cadastrado">{item.createdFormat}</td>
                        <td data-label="#">
                          <button className='action' onClick={() => toggleModal(item)} style={{backgroundColor: '#3583F6'}}>
                            <FiSearch color='#FFF' size={17}/>
                          </button>
                          <Link to={`/new/${item.id}`} className='action' style={{backgroundColor: '#F6A935'}}>
                            <FiEdit2 color='#FFF' size={17}/>
                          </Link>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
              
              {loadingMore && <h3>Buscando mais chamados...</h3>}
              {!loadingMore && !isEmpty && <button onClick={handleMore} className='btnMore'>Buscar mais</button>}
            </>
          )
        }
        </>
      </div>
      {showPostModal && (
        <Modal
        conteudo={detail}
        close={() => setShowPostModal(!showPostModal)}
        />
      )}
      

    </div>
  )
}