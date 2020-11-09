const INITIAL_STATE = {
  nome: '',
  email: '',
  id: '',
  identificado: false
}


export default function Tecnico(state = INITIAL_STATE, action) {
  switch (action.type) {
    case 'SAVE_TECNICO':
      console.log('SAVE_TECNICO');
      return {
        ...state,
        nome: action.nome,
        email: action.email,
        id: action.id,
        identificado: action.identificado
      }
    case 'CLEAR_TECNICO':
      console.log('CLEAR_TECNICO');
      return {
        ...state,
        nome: action.nome,
        email: action.email,
        id: action.id,
        identificado: action.identificado
      }
    default:
      return state
  }
}


