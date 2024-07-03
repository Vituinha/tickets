import './tittle.css'

export default function Tittle({ children, name }){
    return(
        <div className='tittle'>
            { children }
            <span>{ name }</span>
        </div>
    )
}