import React, { useState, useEffect } from "react";
import { notification, Spin, Select, Button, Modal, Input } from 'antd';
import { LoadingOutlined, LeftOutlined, RightOutlined } from '@ant-design/icons';
import jwtDecode from 'jwt-decode';
import XLSX from 'xlsx';
import { ExportSheet } from 'react-xlsx-sheet';
import moment from 'moment';

import { getUsersApi, getUsers2Api, updateUserApi, generateCortesiaCodesApi } from '../../../api/user';
// import { getStatsApi } from '../../../api/stats';
import { getQuestionApi } from '../../../api/question';
import { getPaymentsApi } from '../../../api/payment';
import { getAccessTokenApi } from '../../../api/auth';
// import Socket from '../../../utils/socket';

import up from '../../../assets/img/dashboard/up.png';
import up5 from '../../../assets/img/dashboard/5.png';

const { Option } = Select;
moment.locale();

const userHeaders = [
    { title: 'Nombre completo', dataIndex: 'fullName' },
    { title: 'Correo', dataIndex: 'email' },
    { title: 'Rut', dataIndex: 'rut' },
    { title: 'Teléfono', dataIndex: 'phone' },
    { title: 'Ticket de acceso', dataIndex: 'code' },
    { title: 'Rol', dataIndex: 'role' },
    { title: 'Invitado', dataIndex: 'guest' },
    { title: 'Experiencia gastronómica', dataIndex: 'hobExperience' },
    { title: 'Cantidad de box', dataIndex: 'quantityHobExperience' },
    { title: 'Comuna entrega box', dataIndex: 'communeHobExperience' },
    { title: 'Dirección', dataIndex: 'adress' },
    { title: 'Nº de Compra', dataIndex: '_id' },
    { title: 'Pagó', dataIndex: 'statusPay' },
    { title: 'Pago total', dataIndex: 'totalPayment' },
    { title: 'Total en tickets', dataIndex: 'totalTickets' },
    { title: 'Total en box', dataIndex: 'totalHob' },
    { title: 'Hora de registro y compra', dataIndex: 'signUpTime' },
    { title: 'Hora inicio de sesión', dataIndex: 'signInTime' },
    { title: 'Hora webinar', dataIndex: 'webinarTime' }
];

const paymentsHeaders = [
    { title: 'Nº de Compra', dataIndex: 'user' },
    { title: 'Tipo de moneda', dataIndex: 'currencyType' },
    { title: 'Método de pago', dataIndex: 'paymentMethod' },
    { title: 'Tipo transacción', dataIndex: 'income' },
    { title: 'Estado', dataIndex: 'status' },
    { title: 'Monto total', dataIndex: 'amount' }
];

const cortesiaCodesHeaders = [
    { title: 'Tickets', dataIndex: 'codes' }
];

export default function Dashboard() {

    const [loading, setLoading] = useState(false);
    const [modalLoading, setModalLoading] = useState(false);
    const [visible, setVisible] = useState(false);
    const [visible2, setVisible2] = useState(false);
    // const [usersWaitingRoom, setUsersWaitingRoom] = useState([]);
    // const [statsData, setStatsData] = useState([]);
    const [usersData, setUsersData] = useState([]);
    const [questionData, setQuestionData] = useState([]);
    const [paymentData, setPaymentData] = useState([]);
    const [cortesiaCodes, setCortesiaCodes] = useState('');
    const [arrayCortesiaCodes, setArrayCortesiaCodes] = useState([]);
    const [cortesiaCodesStatus, setCortesiaCodesStatus] = useState(false);
    const [totalUsersCount, setTotalUsersCount] = useState(0);
    const [signInCount, setSignInCount] = useState(0);
    const [waitingRoomCount, setWaitingRoomCount] = useState(0);
    const [streamCount, setStreamCount] = useState(0);
    const [ticketsCount, setTicketsCount] = useState(0);
    const [boxCount, setBoxCount] = useState(0);
    const [headlinesCount, setHeadlinesCount] = useState(0);
    const [guestsCount, setGuestsCount] = useState(0);
    const [totalCLP, setTotalCLP] = useState(0);
    const [totalUSD, setTotalUSD] = useState(0);
    const [from, setFrom] = useState(0);

    useEffect(() => {
        try {
            setLoading(true);
            if (jwtDecode(getAccessTokenApi()) !== undefined) {
                if (jwtDecode(getAccessTokenApi()).role !== 'Admin') {
                    window.location.href = "/dashboard";
                }
            }
            const interval = setInterval(() => {
                // getStats();
                // getUsers();
                getUser();
                getPayments();
                getQuestions();
            }, 5000);
            // Socket.on('UPDATE_USER_LIST', users => {
            //     setUsersWaitingRoom(users)
            // });
            return () => clearInterval(interval);
        } catch (error) {
            window.location.href = "/dashboard";
        }
    }, [from]);

    const numberToString = value => {
        var moneyDots = value.toString().replace(/(\d)(?=(\d\d\d)+(?!\d))/g, "$1.");
        return moneyDots;
    }

    function formatMoney(amount, decimalCount = 2, decimal = ".", thousands = ",") {
        try {
          decimalCount = Math.abs(decimalCount);
          decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
      
          const negativeSign = amount < 0 ? "-" : "";
      
          let i = parseInt(amount = Math.abs(Number(amount) || 0).toFixed(decimalCount)).toString();
          let j = (i.length > 3) ? i.length % 3 : 0;
      
          return negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(amount - i).toFixed(decimalCount).slice(2) : "");
        } catch (e) {
          console.log(e)
        }
    };

    // const getStats = async () => {
    //     await getStatsApi(getAccessTokenApi()).then(resp => {
    //         const arrayStats = [];
    //         resp.stats.forEach(item => {
    //             arrayStats.push(item);
    //         });
    //         setStatsData(arrayStats);
    //         setLoading(false);
    //     });
    // }

    const getPayments = async () => {
        var totalCLP = 0;
        var totalUSD = 0;
        await getPaymentsApi(getAccessTokenApi()).then(resp => {
            const arrayPayments = [];
            resp.payments.forEach(item => {
                if (item.status === 'COMPLETADO') {
                    if (item.currencyType === 'CLP') {
                        totalCLP = totalCLP + item.amount;
                    }
                    if (item.currencyType === 'USD') {
                        totalUSD = totalUSD + item.amount;
                    }
                }
                arrayPayments.push(item);
            });
            setTotalCLP(numberToString(totalCLP));
            setTotalUSD(formatMoney(totalUSD));
            setPaymentData(arrayPayments);
            setLoading(false);
        });
    }

    useEffect(() => {
        getUser();
    }, [from]);

    const getUser = async () => {
        var fromData = {
            from
        }
        var totalUsersCount = 0;
        var signInCount = 0;
        var waitingRoomCount = 0;
        var streamCount = 0;
        var ticketsCount = 0;
        var boxCount = 0;
        var headlinesCount = 0;
        var guestsCount = 0;
        console.log(fromData)
        await getUsers2Api(getAccessTokenApi(), fromData).then(resp => {
            const arrayUsers = [];
            totalUsersCount = resp.total;
            signInCount = totalUsersCount- resp.signInTime;
            waitingRoomCount = totalUsersCount - resp.waitingRoomTime;
            streamCount = totalUsersCount - resp.webinarTime;
            console.log(resp.users[0]);
            resp.users.forEach(item => {
                if (item.quantityHobExperience > 0 && item.statusPay) {
                    boxCount = boxCount + item.quantityHobExperience;
                }
                if (item.statusPay) {
                    ticketsCount = ticketsCount + 1;
                    item.statusPay = 'SI';
                    if (item.guest === null) {
                        headlinesCount = headlinesCount + 1;
                    } else {
                        guestsCount = guestsCount + 1;
                    }
                } else {
                    item.statusPay = 'NO';
                }
                if (item.guest === null) {
                    item.guest = 'NO';
                } else {
                    item.guest = 'SI';
                }
                if (item.hobExperience) {
                    item.hobExperience = 'SI'
                } else {
                    item.hobExperience = 'NO'
                }
                arrayUsers.push(item);
            });
            setTotalUsersCount(totalUsersCount);
            setSignInCount(signInCount);
            setWaitingRoomCount(waitingRoomCount)
            setStreamCount(streamCount)
            setTicketsCount(ticketsCount);
            setBoxCount(boxCount);
            setHeadlinesCount(headlinesCount);
            setGuestsCount(guestsCount);
            setUsersData(arrayUsers);
            setLoading(false);
        });
    }

    const changeFrom = e => {
        if (from >= 0 && e === '+' && from < totalUsersCount) {
            setFrom(from + 300);
        } else {
            if (from >= 300 && e === '-') {
                setFrom(from - 300);
            }
        }
    }

    // const getUsers = async () => {
    //     var totalUsersCount = 0;
    //     var signInCount = 0;
    //     var ticketsCount = 0;
    //     var boxCount = 0;
    //     var headlinesCount = 0;
    //     var guestsCount = 0;
    //     await getUsersApi(getAccessTokenApi()).then(resp => {
    //         const arrayUsers = [];
    //         resp.users.forEach(item => {
    //             if (item.quantityHobExperience > 0 && item.statusPay) {
    //                 boxCount = boxCount + item.quantityHobExperience;
    //             }
    //             totalUsersCount = totalUsersCount + 1;
    //             if (item.signInTime !== '0') {
    //                 signInCount = signInCount + 1;
    //             }
    //             if (item.statusPay) {
    //                 ticketsCount = ticketsCount + 1;
    //                 item.statusPay = 'SI';
    //                 if (item.guest === null) {
    //                     headlinesCount = headlinesCount + 1;
    //                 } else {
    //                     guestsCount = guestsCount + 1;
    //                 }
    //             } else {
    //                 item.statusPay = 'NO';
    //             }
    //             if (item.guest === null) {
    //                 item.guest = 'NO';
    //             } else {
    //                 item.guest = 'SI';
    //             }
    //             if (item.hobExperience) {
    //                 item.hobExperience = 'SI'
    //             } else {
    //                 item.hobExperience = 'NO'
    //             }
    //             arrayUsers.push(item);
    //         });
    //         // headlinesCount = ticketsCount - guestsCount;
    //         setTotalUsersCount(totalUsersCount);
    //         setSignInCount(signInCount);
    //         setTicketsCount(ticketsCount);
    //         setBoxCount(boxCount);
    //         setHeadlinesCount(headlinesCount);
    //         setGuestsCount(guestsCount);
    //         setUsersData(arrayUsers);
    //         setLoading(false);
    //     });
    // }

    const getQuestions = async () => {
        await getQuestionApi(getAccessTokenApi()).then(resp => {
            const arrayQuestions = [];
            resp.preguntas.forEach(item => {
                arrayQuestions.push(item);
            });
            setQuestionData(arrayQuestions);
        });
    }

    const openModal = () => {
        setVisible(!visible);
    }

    const openModal2 = () => {
        setVisible2(!visible2);
    }

    const closeModal = () => {
        setVisible(!visible);
        setCortesiaCodesStatus(false);
        setCortesiaCodes('');
    }

    const closeModal2 = () => {
        setVisible2(!visible2);
    }

    const inputCortesiaCodes = e => {
        if (isNaN(e.target.value)) {
            notification['error']({
                message: "Solo números"
            });
        } else {
            setCortesiaCodes(e.target.value)
        }
    }

    const generateCodes = async () => {
        setModalLoading(true);
        var data = {
            usersCant: cortesiaCodes,
            signUpTime: moment().format('lll')
        };
        await generateCortesiaCodesApi(getAccessTokenApi(), data).then(resp => {
            const arrayCortesiaCodes = [];
            resp.codes.forEach(item => {
                var code = {
                    codes: item
                }
                arrayCortesiaCodes.push(code);
            });
            setArrayCortesiaCodes(arrayCortesiaCodes);
            setCortesiaCodesStatus(true);
            setModalLoading(false);
        });
    }

    const antIcon = <LoadingOutlined style={{ fontSize: 50 }} spin />;

    return (
        <Spin spinning={loading} size="large" indicator={antIcon}>
            <div className="dashboard">
                <div className="header">
                    <div className="contenedor">
                        <div className="logo"><img src={up} alt="up" width="23"/></div>
                        <Button type="primary" danger style={{left: '82%', top: '20px'}} onClick={() => openModal2()}>Estadísticas</Button>
                        <Button type="primary" style={{left: '85%', top: '20px'}} onClick={() => openModal()}>Generar códigos de cortesía</Button>
                    </div>
                </div>
                <div className="contenedor">
                    <div className="row">
                        <div className="mid mid-l">
                            <div className="data">
                                <div>
                                    <div className="box">
                                        <div className="icon ico1"></div>
                                        {totalUsersCount}
                                        <span>Registrados</span>
                                    </div>
                                    <div className="box">
                                        <div className="icon ico2"></div>
                                        {signInCount}
                                        <span>Iniciaron sesión</span>
                                    </div>
                                    <div className="box">
                                        <div className="icon ico3"></div>
                                        {waitingRoomCount}
                                        <span>Sala espera</span>
                                    </div>
                                    <div className="box">
                                        <div className="icon ico4"></div>
                                        {streamCount}
                                        <span>Sala streaming</span>
                                    </div>
                                </div>
                            </div>
                            <div className="box-la">
                                <div className="list">
                                    <table className="table">
                                        <thead>
                                            <tr>
                                                <th>Nombre Completo</th>
                                                <th>Correo</th>
                                                <th>Rut</th>
                                                <th>Teléfono</th>
                                                <th>Ticket de acceso</th>
                                                <th>Rol</th>
                                                <th>Invitado</th>
                                                <th>Experiencia gastronómica</th>
                                                <th>Cantidad de box</th>
                                                <th>Comuna</th>
                                                <th>Dirección</th>
                                                <th>Nº de Compra</th>
                                                <th>Pagó</th>
                                                <th>Pago total</th>
                                                <th>Total en tickets</th>
                                                <th>Total en box</th>
                                                <th>Hora de registro y compra</th>
                                                <th>Hora inicio de sesión</th>
                                                <th>Hora webinar</th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {usersData.map((item, i) => {
                                                return (
                                                    <tr key={i}>
                                                        <td>{item.fullName}</td>
                                                        <td>{item.email}</td>
                                                        <td>{item.rut}</td>
                                                        <td>{item.phone}</td>
                                                        <td>{item.code}</td>
                                                        <td>{item.role}</td>
                                                        {/* <td>
                                                            <SelectRole
                                                                user={item}
                                                                setLoading={setLoading}
                                                            />
                                                        </td> */}
                                                        <td>{item.guest}</td>
                                                        <td>{item.hobExperience}</td>
                                                        <td>{item.quantityHobExperience}</td>
                                                        <td>{item.communeHobExperience}</td>
                                                        <td>{item.adress}</td>
                                                        <td>{item._id}</td>
                                                        <td>{item.statusPay}</td>
                                                        <td>${item.totalPayment}</td>
                                                        <td>${item.totalTickets}</td>
                                                        <td>${item.totalHob}</td>
                                                        <td>{item.signUpTime}</td>
                                                        <td>{item.signInTime}</td>
                                                        <td>{item.webinarTime}</td>
                                                    </tr>
                                                )
                                            })}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <Button
                                type="primary"
                                style={{marginTop: '20px'}}
                                icon={<LeftOutlined />}
                                onClick={() => changeFrom('-')}
                            />
                            <Button
                                type="primary"
                                style={{left: '92%', marginTop: '20px'}}
                                icon={<RightOutlined />}
                                onClick={() => changeFrom('+')}
                            />
                            <div className="btns">
                                <ExportSheet
                                    header={userHeaders}
                                    fileName={`lista_usuarios`}
                                    dataSource={usersData}
                                    xlsx={XLSX}
                                >
                                    <button className="btn">Exportar participantes<img src={up5} alt="Exportar participantes" width="15"/></button>
                                </ExportSheet>
                                <ExportSheet
                                    header={paymentsHeaders}
                                    fileName={`lista_transacciones`}
                                    dataSource={paymentData}
                                    xlsx={XLSX}
                                >
                                    <button className="btn">Exportar transacciones<img src={up5} alt="Exportar transacciones" width="15"/></button>
                                </ExportSheet>
                            </div>

                        </div>
                        <div className="mid mid-s">
                            <div className="cont-preguntas">
                                <h3>Preguntas</h3>
                                <div className="preguntas-list">
                                    {questionData.map((item, i) => {
                                        return (
                                            <p key={i}><strong>{item.name}</strong>{item.question}</p>
                                        )
                                    })}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                title="Códigos de cortesía"
                visible={visible}
                onCancel={() => closeModal()}
                footer={[
                    <Button key="back" type="danger" onClick={() => closeModal()}>
                        Cerrar
                    </Button>
                ]}
            >
                <Spin spinning={modalLoading} size="large" indicator={antIcon}>
                    <Input
                        type="text" 
                        name="cortesiaCodes" 
                        style={{ width: '60%' }}
                        placeholder='Cantidad de códigos'
                        onChange={inputCortesiaCodes}
                        value={cortesiaCodes}
                    />
                    <button className="boton" style={{width:'40%'}} onClick={() => generateCodes()}>Generar códigos</button>
                    <button className="boton" style={{marginTop:'20px', float:'right'}} onClick={() => closeModal()}>Cerrar</button>
                   
                    {cortesiaCodesStatus
                    ? 
                        <div className="dashboard" style={{backgroundColor: '#fff'}}>
                            <div className="btns">
                                <ExportSheet
                                    header={cortesiaCodesHeaders}
                                    fileName={`Codigos de cortesia`}
                                    dataSource={arrayCortesiaCodes}
                                    xlsx={XLSX}
                                >
                                    <button className="btn">Exportar Códigos<img src={up5} alt="Exportar Codigos" width="15"/></button>
                                </ExportSheet>
                            </div>
                        </div>
                    :
                        <div></div>
                    }
                </Spin>
            </Modal>
            <Modal
                title="Estadísticas"
                visible={visible2}
                onCancel={() => closeModal2()}
                footer={[
                    <Button key="back" type="danger" onClick={() => closeModal2()}>
                        Cerrar
                    </Button>
                ]}
            >
                <div className="dashboard" style={{marginBottom: '20px'}}>
                    <div className="box-la">
                        <div className="list">
                            <table className="table2">
                                <thead>
                                    <tr>
                                        <th>Cantidad de tickets vendidos</th>
                                        <th>Cantidad de box vendidos</th>
                                        <th>Cantidad de titulares</th>
                                        <th>Cantidad de invitados</th>
                                        <th>Cantidad en CLP</th>
                                        <th>Cantidad en USD</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{ticketsCount}</td>
                                        <td>{boxCount}</td>
                                        <td>{headlinesCount}</td>
                                        <td>{guestsCount}</td>
                                        <td>${totalCLP}</td>
                                        <td>${totalUSD}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
                <button className="boton" style={{marginTop:'20px', float:'right'}} onClick={() => closeModal2()}>Cerrar</button>

            </Modal>
        </Spin>
    )
}

function SelectRole(props) {
    const {user, setLoading} = props;

    const handleChange = async e => {
        setLoading(true);
        user.role = e.value;
        await updateUserApi(getAccessTokenApi(), user._id).then( async resp => {
            notification["success"]({
                message: resp.message
            });
        });
        setLoading(false);
    }

    if (user.role === 'Admin') {
        return (
            <Select
                labelInValue
                defaultValue={{ value: user.role }}
                style={{ width: 120 }}
                onChange={handleChange}
            >
                <Option value={user.role}>{user.role}</Option>
                <Option value="User">User</Option>
            </Select>
        )
    } else {
        return (
            <Select
                labelInValue
                defaultValue={{ value: user.role }}
                style={{ width: 120 }}
                onChange={handleChange}
            >
                <Option value={user.role}>{user.role}</Option>
                <Option value="Admin">Admin</Option>
            </Select>
        )
    }
}
