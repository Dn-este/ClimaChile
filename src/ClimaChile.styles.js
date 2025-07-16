import styled, { keyframes, css } from 'styled-components';

// Animaciones
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const spin = keyframes`
  to { transform: rotate(360deg); }
`;

// Estilos
export const Page = styled.div`
  font-family: 'Segoe UI', sans-serif;
  background: linear-gradient(to bottom right, #e0f7fa, #fff);
  min-height: 100vh;
  padding-top: 70px;
`;

export const Navbar = styled.nav`
  position: fixed;
  top: 0;
  width: 100%;
  background: linear-gradient(90deg, #1e3c72 0%, #ffd700 100%);
  color: #fff;
  padding: 1.5rem 2rem;
  font-size: 2.2rem;
  font-weight: bold;
  box-shadow: 0 4px 24px rgba(30,60,114,0.18);
  z-index: 1000;
  display: flex;
  justify-content: center;
  align-items: center;
  border-bottom: 4px solid #ffd700;
  letter-spacing: 2px;
  text-shadow: 0 2px 12px #1e3c72, 0 0px 2px #ffd700;

  @media (max-width: 700px) {
    flex-direction: column !important;
    gap: 10px !important;
    padding: 1rem 0.5rem !important;
    font-size: 1.3rem;
  }
`;

export const TempContainer = styled.div`
  display: flex;
  gap: 1.5rem;
  font-size: 1rem;

  @media (max-width: 700px) {
    justify-content: center !important;
    width: 100% !important;
    margin: 0 !important;
  }
`;

export const TempItem = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.3rem 0.8rem;
  border-radius: 20px;
  background: rgba(255,255,255,0.2);

  &:first-child {
    color: #a1c4fd;
  }

  &:last-child {
    color: #ff9a9e;
  }
`;

export const Container = styled.div`
  max-width: 1000px;
  margin: auto;
  padding: 2rem 1rem;
  animation: ${fadeIn} 0.6s ease-in;

  @media (max-width: 600px) {
    padding: 1rem 0.3rem;
    max-width: 100vw;
  }
`;

export const InputGroup = styled.div`
  display: flex;
  justify-content: center;
  gap: 0.5rem;
  margin-bottom: 2rem;
  flex-wrap: wrap;

  input {
    padding: 0.6rem;
    font-size: 1rem;
    border-radius: 8px;
    border: 1px solid #ccc;
    width: 280px;
    transition: box-shadow 0.3s;
    
    &:focus {
      outline: none;
      box-shadow: 0 0 5px #00796b;
    }
  }

  button {
    padding: 0.6rem 1.2rem;
    background-color: #00796b;
    border: none;
    color: white;
    border-radius: 8px;
    cursor: pointer;
    transition: background 0.3s;
    
    &:hover {
      background-color: #004d40;
    }
  }
`;

export const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1rem;
  margin-top: 1rem;

  @media (max-width: 600px) {
    grid-template-columns: 1fr;
    gap: 0.7rem;
  }
`;

export const Card = styled.div`
  background: ${({ $bg }) => $bg || 'white'};
  padding: 1.2rem;
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.08);
  text-align: center;
  animation: ${fadeIn} 0.5s ease;
  cursor: pointer;
  transition: transform 0.3s, box-shadow 0.3s;
  
  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 6px 16px rgba(0,0,0,0.12);
  }
`;

export const Ciudad = styled.h3`
  font-size: 1.3rem;
  color: #333;
  margin-bottom: 0.5rem;
`;

export const Temperatura = styled.p`
  font-size: 2.4rem;
  font-weight: bold;
  margin: 0.5rem 0;
`;

export const Estado = styled.p`
  font-style: italic;
  color: #666;
  margin-bottom: 0.5rem;
`;

export const Spinner = styled.div`
  margin: 2rem auto;
  border: 6px solid #eee;
  border-top: 6px solid #00796b;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  animation: ${spin} 1s linear infinite;
`;

export const Subtitulo = styled.h2`
  margin-top: 2rem;
  font-size: 1.5rem;
  color: #004d40;
  text-align: center;
`;

export const PronosticoCard = styled.div`
  display: flex;
  justify-content: space-around;
  flex-wrap: wrap;
  margin-top: 1rem;
  background: #f9f9f9;
  border-radius: 16px;
  padding: 1rem;
  box-shadow: 0 2px 8px rgba(0,0,0,0.05);
`;

export const Dia = styled.div`
  margin: 0.5rem;
  text-align: center;
  min-width: 100px;
`;

export const ModalContent = styled.div`
  padding: 2rem;
  max-width: 90vw;
  margin: 0 auto;
  max-height: 70vh;
  overflow-y: auto;
  box-sizing: border-box;
`;

export const ModalHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  position: sticky;
  top: 0;
  background: white;
  padding: 1rem 0;
  z-index: 10;
`;

export const ModalTitle = styled.h2`
  color: #00796b;
  margin: 0;
`;

export const CloseButton = styled.button`
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: #666;
  position: absolute;
  right: 1.5rem;
  top: 1.5rem;
  z-index: 11;
`;

export const ExtremesContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 1rem;
  margin-top: 2rem;
  flex-wrap: wrap;
`;

export const ExtremeCard = styled(Card)`
  flex: 1;
  min-width: 250px;
  ${props => props.tipo === 'frio' && css`
    background: linear-gradient(135deg, #e0f7fa, #b2ebf2);
    ${Temperatura} {
      color: #006064;
    }
  `}
  ${props => props.tipo === 'calor' && css`
    background: linear-gradient(135deg, #ffebee, #ffcdd2);
    ${Temperatura} {
      color: #b71c1c;
    }
  `}
`;

export const WeatherIcon = styled.img`
  width: 64px;
  height: 64px;
  margin: 0.5rem 0;
`;

export const CustomModal = styled.div`
  content: {
    max-width: '90vw',
    width: '100%',
    margin: '0 auto',
    padding: 0,
    border-radius: 20,
    box-shadow: '0 8px 32px 0 rgba(31,38,135,0.25)',
  }
`;