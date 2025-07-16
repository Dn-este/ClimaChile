import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from 'react-modal';
import { FiThermometer, FiSearch, FiX, FiMapPin } from 'react-icons/fi';
import {
  Page,
  Navbar,
  TempContainer,
  TempItem,
  Container,
  InputGroup,
  Grid,
  Card,
  Ciudad,
  Temperatura,
  Estado,
  Spinner,
  Subtitulo,
  PronosticoCard,
  Dia,
  ModalContent,
  ModalHeader,
  ModalTitle,
  CloseButton,
  ExtremesContainer,
  ExtremeCard,
  WeatherIcon
} from './ClimaChile.styles';

// --- NUEVOS ESTILOS EN LINEA Y FONDOS ---
const gradientBg = {
  minHeight: '100vh',
  background: 'linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #e9e4f0 100%)',
  paddingBottom: 40
};

const glassCard = {
  background: 'rgba(255,255,255,0.18)',
  borderRadius: 20,
  boxShadow: '0 8px 32px 0 rgba(31,38,135,0.37)',
  backdropFilter: 'blur(8px)',
  border: '1px solid rgba(255,255,255,0.18)',
  color: '#222',
  margin: '16px 0'
};

const glassExtreme = {
  ...glassCard,
  border: '2px solid #fff',
  background: 'rgba(255,255,255,0.25)',
  color: '#111',
  minWidth: 220,
  minHeight: 180,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center'
};

const navStyle = {
  background: 'rgba(30,60,114,0.95)',
  color: '#fff',
  padding: '12px 2vw',
  fontSize: '5vw',
  fontWeight: 700,
  letterSpacing: 2,
  boxShadow: '0 2px 16px 0 rgba(30,60,114,0.15)',
  position: 'relative',
  zIndex: 10,
  display: 'flex',
  flexWrap: 'wrap',
  alignItems: 'center',
  justifyContent: 'center'
};

const searchStyle = {
  background: 'rgba(255,255,255,0.7)',
  borderRadius: 12,
  boxShadow: '0 2px 8px 0 rgba(30,60,114,0.10)',
  padding: 12,
  margin: '32px auto 24px auto',
  maxWidth: 98 + 'vw',
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  gap: 8,
  flexWrap: 'wrap'
};

const mainGrid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: 20,
  margin: '32px 0'
};

const subtitleStyle = {
  color: '#fff',
  fontWeight: 600,
  fontSize: 22,
  margin: '32px 0 12px 0',
  letterSpacing: 1
};

const extremesContainerStyle = {
  display: 'flex',
  gap: 32,
  justifyContent: 'center',
  margin: '32px 0'
};

const modalContentStyle = {
  background: 'rgba(255,255,255,0.95)',
  borderRadius: 20,
  padding: 32,
  maxWidth: 600,
  margin: 'auto',
  boxShadow: '0 8px 32px 0 rgba(31,38,135,0.25)'
};

const API_KEY = "2f45ed983f214dfc8f304359251007";
const ciudadesChile = ['Santiago', 'Valparaiso', 'Concepcion', 'La Serena', 'Antofagasta', 'Puerto Montt'];

Modal.setAppElement('#root');

const ClimaChile = () => {
  const [busqueda, setBusqueda] = useState('');
  const [climaCiudad, setClimaCiudad] = useState(null);
  const [climasPrincipales, setClimasPrincipales] = useState([]);
  const [loading, setLoading] = useState(true);
  const [buscando, setBuscando] = useState(false);
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [ciudadSeleccionada, setCiudadSeleccionada] = useState(null);
  const [pronostico, setPronostico] = useState(null);
  const [loadingPronostico, setLoadingPronostico] = useState(false);

  const buscarClima = async () => {
    if (!busqueda.trim()) return;
    try {
      setBuscando(true);
      const res = await axios.get('http://api.weatherapi.com/v1/forecast.json', {
        params: {
          key: API_KEY,
          q: `${busqueda}, Chile`,
          days: 5,
          lang: 'es'
        }
      });
      setClimaCiudad(res.data);
    } catch (err) {
      alert('Ciudad no encontrada o error con la API');
      setClimaCiudad(null);
    } finally {
      setBuscando(false);
    }
  };

  const abrirModal = async (ciudad) => {
    setCiudadSeleccionada(ciudad);
    setLoadingPronostico(true);
    setModalIsOpen(true);
    try {
      const res = await axios.get('http://api.weatherapi.com/v1/forecast.json', {
        params: {
          key: API_KEY,
          q: `${ciudad.location.name}, Chile`,
          days: 1,
          lang: 'es'
        }
      });
      setPronostico(res.data);
    } catch (err) {
      console.error("Error cargando pronóstico:", err);
      setPronostico(null);
    } finally {
      setLoadingPronostico(false);
    }
  };

  const cerrarModal = () => {
    setModalIsOpen(false);
    setCiudadSeleccionada(null);
    setPronostico(null);
  };

  useEffect(() => {
    const fetchClimas = async () => {
      try {
        const promesas = ciudadesChile.map(async (ciudad) => {
          const res = await axios.get('http://api.weatherapi.com/v1/forecast.json', {
            params: {
              key: API_KEY,
              q: `${ciudad}, Chile`,
              days: 1,
              lang: 'es'
            }
          });
          return res.data;
        });

        const resultados = await Promise.all(promesas);
        const filtrados = resultados.filter(
          (res) => res && res.location && res.current
        );
        setClimasPrincipales(filtrados);
      } catch (err) {
        console.error("Error cargando ciudades principales:", err);
        setClimasPrincipales([]);
      } finally {
        setLoading(false);
      }
    };
    fetchClimas();
  }, []);

  useEffect(() => {
    if (!climaCiudad) {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(async (position) => {
          try {
            const { latitude, longitude } = position.coords;
            const res = await axios.get('http://api.weatherapi.com/v1/forecast.json', {
              params: {
                key: API_KEY,
                q: `${latitude},${longitude}`,
                days: 5,
                lang: 'es'
              }
            });
            setClimaCiudad(res.data);
          } catch (err) {
            // Si falla, no hace nada
          }
        });
      }
    }
  }, []);

  // Encontrar ciudades con temperaturas extremas (según pronóstico del día, no actual)
  const ciudadMasFria = climasPrincipales.length > 0
    ? climasPrincipales.reduce((prev, current) =>
        (prev.forecast?.forecastday?.[0]?.day?.mintemp_c ?? Infinity) <
        (current.forecast?.forecastday?.[0]?.day?.mintemp_c ?? Infinity)
          ? prev
          : current
      )
    : null;

  const ciudadMasCalida = climasPrincipales.length > 0
    ? climasPrincipales.reduce((prev, current) =>
        (prev.forecast?.forecastday?.[0]?.day?.maxtemp_c ?? -Infinity) >
        (current.forecast?.forecastday?.[0]?.day?.maxtemp_c ?? -Infinity)
          ? prev
          : current
      )
    : null;

  return (
    <div style={gradientBg}>
      <Navbar style={navStyle}>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            flexWrap: 'wrap',
            width: '100%',
            justifyContent: 'center',
            gap: 16,
            flexDirection: 'row',
          }}
          className="navbar-flex"
        >
          <span
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              fontSize: 'clamp(2rem, 6vw, 4rem)',
              fontWeight: 700,
              letterSpacing: 2,
              justifyContent: 'center',
              width: '100%',
              textAlign: 'center'
            }}
          >
            <FiMapPin style={{ fontSize: 32, color: '#ffd700', marginRight: 8 }} />
            Clima en Chile
          </span>
          {climaCiudad && (
            <TempContainer
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                marginLeft: 16,
                marginRight: 16,
                flexWrap: 'wrap',
                justifyContent: 'center',
                width: '100%',
              }}
              className="navbar-temp"
            >
              <TempItem style={{ pointerEvents: 'auto', color: '#00c3ff', fontWeight: 700 }}>
                <FiThermometer style={{ transform: 'rotate(180deg)' }} />
                {climaCiudad.forecast.forecastday[0].day.mintemp_c}°C
              </TempItem>
              <span style={{
                fontWeight: 700,
                margin: '0 8px',
                pointerEvents: 'auto',
                color: '#fff',
                fontSize: 20,
                textShadow: '0 2px 8px #1e3c72'
              }}>
                {climaCiudad.location.name}
              </span>
              <TempItem style={{ pointerEvents: 'auto', color: '#ff7e5f', fontWeight: 700 }}>
                <FiThermometer />
                {climaCiudad.forecast.forecastday[0].day.maxtemp_c}°C
              </TempItem>
            </TempContainer>
          )}
        </div>
      </Navbar>

      <Container style={{ maxWidth: '90%', width: '100', margin: '10 auto', padding: '0 2vw' }}>
        <div style={searchStyle}>
          <input
            type="text"
            placeholder="Buscar ciudad..."
            value={busqueda}
            onChange={(e) => setBusqueda(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && buscarClima()}
            style={{
              flex: 1,
              border: 'none',
              outline: 'none',
              background: 'transparent',
              fontSize: 18,
              color: '#1e3c72'
            }}
          />
          <button
            onClick={buscarClima}
            style={{
              background: 'linear-gradient(90deg,#00c3ff,#ffff1c)',
              border: 'none',
              borderRadius: 8,
              padding: '8px 18px',
              color: '#222',
              fontWeight: 700,
              fontSize: 16,
              cursor: 'pointer',
              boxShadow: '0 2px 8px 0 rgba(30,60,114,0.10)'
            }}
          >
            <FiSearch /> Buscar
          </button>
        </div>

        {buscando && <Spinner />}

        {climaCiudad && !buscando && (
          <>
            <Card style={{ ...glassCard, textAlign: 'center', padding: 32, marginTop: 24 }}>
              <Ciudad style={{ fontSize: 32, fontWeight: 700, color: '#1e3c72', letterSpacing: 1 }}>
                {climaCiudad.location.name}
              </Ciudad>
              <Temperatura style={{ fontSize: 48, fontWeight: 800, color: '#ff7e5f', margin: '12px 0' }}>
                {climaCiudad.current.temp_c}°C
              </Temperatura>
              <Estado style={{ fontSize: 22, color: '#1e3c72', fontWeight: 600 }}>
                {climaCiudad.current.condition.text}
              </Estado>
              <WeatherIcon
                src={climaCiudad.current.condition.icon}
                alt={climaCiudad.current.condition.text}
                style={{ width: 90, height: 90, margin: '18px auto 0 auto', display: 'block' }}
              />
            </Card>

            <div style={subtitleStyle}>Pronóstico próximos días</div>
            <PronosticoCard style={{ ...mainGrid, background: 'rgba(255,255,255,0.10)', borderRadius: 16, padding: 16 }}>
              {climaCiudad.forecast.forecastday.map((dia, i) => (
                <Dia key={i} style={{ ...glassCard, padding: 18, minHeight: 180, textAlign: 'center' }}>
                  <strong style={{ fontSize: 18, color: '#1e3c72' }}>
                    {new Date(dia.date).toLocaleDateString('es-CL', { weekday: 'long' })}
                  </strong>
                  <p style={{ fontSize: 16, margin: '8px 0', color: '#222' }}>
                    🌡️ {dia.day.mintemp_c}°C - {dia.day.maxtemp_c}°C
                  </p>
                  <img src={dia.day.condition.icon} alt={dia.day.condition.text} style={{ width: 56, height: 56 }} />
                  <Estado style={{ color: '#1e3c72', fontWeight: 600 }}>{dia.day.condition.text}</Estado>
                </Dia>
              ))}
            </PronosticoCard>
          </>
        )}

        <div style={subtitleStyle}>Ciudades principales</div>
        {loading ? (
          <Spinner />
        ) : (
          <div style={mainGrid}>
            {climasPrincipales.map((clima, i) =>
              clima?.location?.name && clima?.current?.temp_c ? (
                <Card key={i} style={{ ...glassCard, textAlign: 'center', padding: 24, cursor: 'pointer', transition: 'transform 0.2s', minHeight: 210 }}
                  onClick={() => abrirModal(clima)}
                  onMouseOver={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseOut={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  <Ciudad style={{ fontSize: 22, fontWeight: 700, color: '#1e3c72' }}>
                    {clima.location.name}
                  </Ciudad>
                  <Temperatura style={{ fontSize: 32, fontWeight: 800, color: '#ff7e5f', margin: '8px 0' }}>
                    {clima.current.temp_c}°C
                  </Temperatura>
                  <Estado style={{ fontSize: 16, color: '#1e3c72', fontWeight: 600 }}>
                    {clima.current.condition.text}
                  </Estado>
                  <WeatherIcon
                    src={clima.current.condition.icon}
                    alt={clima.current.condition.text}
                    style={{ width: 56, height: 56, margin: '12px auto 0 auto', display: 'block' }}
                  />
                </Card>
              ) : null
            )}
          </div>
        )}

        {!loading && climasPrincipales.length > 0 && (
          <>
            <div style={subtitleStyle}>🌡️ Temperaturas extremas hoy</div>
            <div style={extremesContainerStyle}>
              {ciudadMasFria && ciudadMasFria.forecast && (
                <ExtremeCard tipo="frio" style={{ ...glassExtreme, border: '2px solid #00c3ff', background: 'rgba(0,195,255,0.10)' }}>
                  <Ciudad style={{ fontWeight: 700, color: '#00c3ff', fontSize: 20 }}>
                    ❄️ Más fría: {ciudadMasFria.location.name}
                  </Ciudad>
                  <Temperatura style={{ fontSize: 36, fontWeight: 800, color: '#00c3ff', margin: '8px 0' }}>
                    {ciudadMasFria.forecast.forecastday[0].day.mintemp_c}°C
                  </Temperatura>
                  <Estado style={{ color: '#1e3c72', fontWeight: 600 }}>
                    {ciudadMasFria.forecast.forecastday[0].day.condition.text}
                  </Estado>
                  <WeatherIcon
                    src={ciudadMasFria.forecast.forecastday[0].day.condition.icon}
                    alt={ciudadMasFria.forecast.forecastday[0].day.condition.text}
                    style={{ width: 48, height: 48, marginTop: 8 }}
                  />
                </ExtremeCard>
              )}

              {ciudadMasCalida && ciudadMasCalida.forecast && (
                <ExtremeCard tipo="calor" style={{ ...glassExtreme, border: '2px solid #ff7e5f', background: 'rgba(255,126,95,0.10)' }}>
                  <Ciudad style={{ fontWeight: 700, color: '#ff7e5f', fontSize: 20 }}>
                    🔥 Más cálida: {ciudadMasCalida.location.name}
                  </Ciudad>
                  <Temperatura style={{ fontSize: 36, fontWeight: 800, color: '#ff7e5f', margin: '8px 0' }}>
                    {ciudadMasCalida.forecast.forecastday[0].day.maxtemp_c}°C
                  </Temperatura>
                  <Estado style={{ color: '#1e3c72', fontWeight: 600 }}>
                    {ciudadMasCalida.forecast.forecastday[0].day.condition.text}
                  </Estado>
                  <WeatherIcon
                    src={ciudadMasCalida.forecast.forecastday[0].day.condition.icon}
                    alt={ciudadMasCalida.forecast.forecastday[0].day.condition.text}
                    style={{ width: 48, height: 48, marginTop: 8 }}
                  />
                </ExtremeCard>
              )}
            </div>
          </>
        )}

        <Modal
          isOpen={modalIsOpen}
          onRequestClose={cerrarModal}
          contentLabel="Pronóstico del tiempo"
          style={{
            overlay: {
              background: 'rgba(30,60,114,0.45)',
              zIndex: 1000,
              backdropFilter: 'blur(2px)'
            },
            content: {
              ...modalContentStyle,
              background: 'linear-gradient(135deg, #e9e4f0 0%, #fff 100%)',
              border: 'none',
              boxShadow: '0 8px 32px 0 rgba(31,38,135,0.25)',
              padding: 0,
              maxWidth: '90vw',
              width: '100%',
              margin: '0 auto',
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              transform: 'translate(-50%, -50%)',
              maxHeight: '90vh', // Limita el alto del modal
              boxSizing: 'border-box'
            }
          }}
        >
          {ciudadSeleccionada && (
            <ModalContent style={{ borderRadius: 20, background: 'rgba(255,255,255,0.90)' }}>
              <ModalHeader style={{ background: 'rgba(30,60,114,0.90)', padding: 20, borderTopLeftRadius: 20, borderTopRightRadius: 20 }}>
                <ModalTitle style={{ color: '#ffd700', fontWeight: 800, fontSize: 26, letterSpacing: 1 }}>
                  Pronóstico para {ciudadSeleccionada.location.name}
                </ModalTitle>
                <CloseButton onClick={cerrarModal} style={{ color: '#fff', fontSize: 28 }}>
                  <FiX />
                </CloseButton>
              </ModalHeader>
              
              {loadingPronostico ? (
                <Spinner />
              ) : pronostico ? (
                <>
                  <Card
                    $bg="linear-gradient(135deg,rgba(255,255,255,0.18),rgba(30,60,114,0.08))"
                    style={{
                      textAlign: 'center',
                      padding: '6vw 2vw',
                      margin: 0,
                      borderRadius: 0,
                      border: 'none',
                      boxShadow: 'none',
                      width: '100%',
                      maxWidth: '98vw'
                    }}
                  >
                    <Temperatura style={{ fontSize: 44, fontWeight: 800, color: '#ff7e5f', margin: '8px 0' }}>
                      {pronostico.current.temp_c}°C
                    </Temperatura>
                    <Estado style={{ fontSize: 20, color: '#1e3c72', fontWeight: 700 }}>
                      {pronostico.current.condition.text}
                    </Estado>
                    <WeatherIcon
                      src={pronostico.current.condition.icon}
                      alt={pronostico.current.condition.text}
                      style={{ width: 70, height: 70, margin: '18px auto 0 auto', display: 'block' }}
                    />
                    <div style={{ color: '#1e3c72', margin: '12px 0 0 0', fontWeight: 600 }}>Humedad: {pronostico.current.humidity}%</div>
                    <div style={{ color: '#1e3c72', margin: 0, fontWeight: 600 }}>Viento: {pronostico.current.wind_kph} km/h</div>
                  </Card>

                  <div style={{ ...subtitleStyle, color: '#1e3c72', marginTop: 24 }}>Pronóstico próximos días</div>
                  <PronosticoCard style={{ ...mainGrid, background: 'rgba(255,255,255,0.10)', borderRadius: 16, padding: 16 }}>
                    {pronostico.forecast.forecastday.map((dia, i) => (
                      <Dia key={i} style={{ ...glassCard, padding: 18, minHeight: 180, textAlign: 'center', background: 'rgba(255,255,255,0.18)' }}>
                        <strong style={{ fontSize: 18, color: '#1e3c72', letterSpacing: 1 }}>
                          {new Date(dia.date).toLocaleDateString('es-CL', { weekday: 'long' })}
                        </strong>
                        <p style={{ fontSize: 16, margin: '8px 0', color: '#222', fontWeight: 600 }}>
                          🌡️ {dia.day.mintemp_c}°C - {dia.day.maxtemp_c}°C
                        </p>
                        <img src={dia.day.condition.icon} alt={dia.day.condition.text} style={{ width: 56, height: 56 }} />
                        <Estado style={{ color: '#1e3c72', fontWeight: 600 }}>{dia.day.condition.text}</Estado>
                      </Dia>
                    ))}
                  </PronosticoCard>
                </>
              ) : (
                <p style={{ color: '#1e3c72', padding: 24 }}>No se pudo cargar el pronóstico</p>
              )}
            </ModalContent>
          )}
        </Modal>
      </Container>
    </div>
  );
};

export default ClimaChile;