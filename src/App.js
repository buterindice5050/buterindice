import "./App.css";
import { useState, useEffect } from "react";
import { ethers } from "ethers";
import { Icon } from "@iconify/react";
import { withStyles, makeStyles } from "@material-ui/core/styles";
import Card from "@material-ui/core/Card";
import { Chart, PieSeries, Legend } from "@devexpress/dx-react-chart-material-ui";
import Fab from "@material-ui/core/Fab";
import CircularProgress from "@material-ui/core/CircularProgress";
import { orange, green } from "@material-ui/core/colors";
import ethereumIcon from "@iconify-icons/mdi/ethereum";
import CardContent from "@material-ui/core/CardContent";
import InputAdornment from "@material-ui/core/InputAdornment";
import Typography from "@material-ui/core/Typography";
import TextField from "@material-ui/core/TextField";
import Slider from "@material-ui/core/Slider";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableContainer from "@material-ui/core/TableContainer";
import TableRow from "@material-ui/core/TableRow";
import Paper from "@material-ui/core/Paper";
import useWindowSize from "react-use/lib/useWindowSize";
import Confetti from "react-confetti";
import Alert from "@material-ui/lab/Alert";
import * as Tone from "tone";
import Dice from "./artifacts/contracts/ButerinDice.sol/ButerinDice.json";
import NFT from "./artifacts/contracts/GameItem.sol/GameItem.json";
import collectERC20 from "./collectERC20";

const log = (w) => alert("LOG: " + JSON.stringify(w));

const PrettoSlider = withStyles({
    root: {
        color: "#52af77",
        height: 12,
        marginTop: 12,
        width: "80%",
    },
    thumb: {
        height: 44,
        width: 44,
        backgroundColor: "#fff",
        border: "2px solid currentColor",
        marginTop: -14,
        marginLeft: -12,
        "&:focus, &:hover, &$active": {
            boxShadow: "inherit",
        },
    },
    active: {},
    valueLabel: {
        left: "calc(-50% + 4px)",
    },
    track: {
        height: 16,
        borderRadius: 4,
    },
    rail: {
        height: 16,
        borderRadius: 4,
    },
})(Slider);

const useStyles = makeStyles((theme) => ({
    root: {
        minWidth: 275,
        display: "flex",
        alignItems: "center",
    },
    wrapper: {
        margin: theme.spacing(3),
        position: "relative",
        selfAlign: "center",
    },
    bullet: {
        display: "inline-block",
        margin: "0 2px",
        transform: "scale(0.8)",
    },
    playGame: {
        margin: theme.spacing(4),
        color: (props) => (props.win ? theme.palette.getContrastText("#00ab12") : theme.palette.getContrastText("#ff0000")),
        backgroundColor: (props) => (props.win ? "#00ab12" : "#ff0000"),
        fontWeight: "bold",
        fontSize: 30,
    },
    title: {
        fontSize: 24,
        fontWeight: "bold",
    },
    result: {
        fontSize: 20,
        fontWeight: "bold",
        width: "90%",
        margin: theme.spacing(2),
    },
    gameInfo: {
        fontSize: 16,
        padding: "1em",
        fontWeight: "bold",
    },
    icon: {
        height: 200,
        fontSize: 40,
    },
    pos: {
        marginBottom: 12,
    },
    margin: {
        margin: theme.spacing(2),
    },
    extendedIcon: {
        marginRight: theme.spacing(1),
    },
    paper: {
        margin: "0 auto",
        width: "90%",
    },
    table: {
        width: "100%",
    },
    avatar: {
        margin: theme.spacing(1),
        color: theme.palette.getContrastText("#00ab12"),
        backgroundColor: "#00ab12",
    },
    winner: {
        margin: theme.spacing(1),
        color: (props) => (props.win ? theme.palette.getContrastText("#00ab12") : theme.palette.getContrastText("#ff0000")),
        backgroundColor: (props) => (props.win ? "#00ab12" : "#ff0000"),
    },
    fab: {
        backgroundColor: orange[500],
        color: "#ffffff",
        height: 100,
        width: 100,
    },
    fabProgress: {
        color: green[500],
        position: "absolute",
        top: -6,
        left: -6,
        zIndex: 1,
    },
    bet: {
        textAlign: "center",
        fontSize: 20,
        fontWeight: "bold",
    },
}));
//const diceAddress = "0xCf3BD0DA4D270Ad56b8e7F3Cca6ddC82565c7B2f";
const nftAddress = "0xdb39D08879a87fBc17f603a7CEC0060C147b91CA";
const diceAddress = "0xAA378bf51592aa4994aB8626788CC07B757622b1";

const EthLogo = (props) => {
    const classes = useStyles(props);
    const { width, height } = useWindowSize();
    return (
        <div className="logo-wrapper">
            {props.win ? <Confetti recycle={false} tweenDuration={2500} width={width} height={height} /> : null}
            <Card className={classes.root}>
                <CardContent>
                    <Typography className={classes.title} color="textSecondary" gutterBottom>
                        Buterin Dice
                    </Typography>
                    <TableContainer className={classes.paper} component={Paper}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableBody>
                                <TableRow key={"1"}>
                                    <TableCell component="th" scope="row">
                                        {"Contract Balance"}
                                    </TableCell>
                                    <TableCell align="right">{props.balance}</TableCell>
                                </TableRow>
                                <TableRow key={"2"}>
                                    <TableCell component="th" scope="row">
                                        {"MAX Bet"}
                                    </TableCell>
                                    <TableCell align="right">{props.max}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                    <div className={classes.wrapper}>
                        <Fab color={"primary"} disabled={props.bet > props.max} onClick={() => props.payWithMetamask()} disableFocusRipple className={[classes.fab]}>
                            <Icon icon={ethereumIcon} height={128} />
                            {props.loading && <CircularProgress size={114} className={classes.fabProgress} />}
                        </Fab>
                    </div>
                    {props.gameStatus === "gameover" && (
                        <Typography className={classes.result} color="textSecondary" gutterBottom>
                            {props.gameStatus === "gameover" && props.win && (
                                <Alert variant="filled" severity="success">
                                    {`You won 🥳👍${props.total} ETH`}
                                </Alert>
                            )}
                            {props.gameStatus === "gameover" && !props.win && (
                                <Alert variant="filled" severity="error">
                                    {`You lost 😔${props.total} ETH`}
                                </Alert>
                            )}
                        </Typography>
                    )}
                    {props.gameStatus !== "gameover" && (
                        <TextField
                            id="outlined-basic"
                            className={classes.margin}
                            InputProps={{
                                classes: {
                                    input: classes.bet,
                                },
                                startAdornment: (
                                    <InputAdornment onClick={props.handleButtonClick} position="start">
                                        {props.bet <= props.balance / 40 && <span style={{ fontSize: "44px" }}>😐</span>}
                                        {props.bet > props.balance / 40 && props.bet <= props.balance / 30 && <span style={{ fontSize: "44px" }}>😀</span>}
                                        {props.bet > props.balance / 30 && props.bet < props.balance / 10 && <span style={{ fontSize: "44px" }}>🤑</span>}
                                        {props.bet == props.max && <span style={{ fontSize: "44px" }}>🤯</span>}
                                        {props.bet > props.max && <span style={{ fontSize: "44px" }}>⛔</span>}
                                    </InputAdornment>
                                ),
                            }}
                            onChange={(e) => props.setBet(e, e.target.value)}
                            value={props.bet}
                            label="Place your bet"
                            variant="outlined"
                        />
                    )}
                    <PrettoSlider onChange={props.setBet} value={props.bet} min={props.min} max={props.max} />
                    <TableContainer className={classes.paper} component={Paper}>
                        <Table className={classes.table} size="small" aria-label="a dense table">
                            <TableBody>
                                <TableRow key={"1"}>
                                    <TableCell component="th" scope="row">
                                        {"Total Games Played"}
                                    </TableCell>
                                    <TableCell align="right">{props.gamesPlayed}</TableCell>
                                </TableRow>
                                <TableRow key={"2"}>
                                    <TableCell component="th" scope="row">
                                        {"Total Winners"}
                                    </TableCell>
                                    <TableCell align="right">{props.winners}</TableCell>
                                </TableRow>
                                <TableRow key={"3"}>
                                    <TableCell component="th" scope="row">
                                        {"Total Losers"}
                                    </TableCell>
                                    <TableCell align="right">{props.losers}</TableCell>
                                </TableRow>
                            </TableBody>
                        </Table>
                    </TableContainer>
                </CardContent>
            </Card>
            <div className={""}>
                <Chart data={props.chartData}>
                    <PieSeries valueField="total" argumentField="group" />
                    <Legend visible={true} />
                </Chart>
            </div>
        </div>
    );
};

function App() {
    const [gamesPlayed, setGamesPlayed] = useState();
    const [winners, setWinners] = useState();
    const [losers, setlosers] = useState();
    const [balance, setBalance] = useState(0);
    const [chartData, setChartData] = useState([]);
    const [win, setWin] = useState(false);
    const [min, setMin] = useState(0);
    const [max, setMax] = useState(0);
    const [total, setTotal] = useState(0);
    const [bet, setBet] = useState(0);
    const [loading, setLoading] = useState(false);
    const [gameStatus, setGameStatus] = useState("init");

    const payWithMetamask = async () => {
        let provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const userAddress = await signer.getAddress();
        const params = [
            {
                gasPrice: ethers.utils.parseUnits("1.0", "gwei").toHexString(),
                gasLimit: "155839",
                gas: "83004",
                from: userAddress,
                to: diceAddress,
                value: ethers.utils.parseUnits(String(bet), "wei").toHexString(),
            },
        ];
        const transactionHash = await provider.send("eth_sendTransaction", params);
        setLoading(true);
        setGameStatus("running");
    };

    const handleChange = (event, newValue) => {
        setBet(newValue);
    };

    const handleButtonClick = () => {
        if (!loading) {
            setBet(max);
        }
    };

    useEffect(() => {
        const synth = new Tone.Synth().toDestination();
        async function requestAccount() {
            const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const played = await fetchGamesPlayed();
            const wei = await provider.getBalance(diceAddress);
            setBalance(wei);
            setMax(parseFloat(wei * 0.1));
            setGamesPlayed(parseInt(played.gamesPlayed));
            setWinners(parseInt(played.winners));
            setlosers(parseInt(played.losers));
            setChartData([
                { group: "losers", total: played.losers },
                { group: "winners", total: played.winners },
            ]);

            const contract = new ethers.Contract(diceAddress, Dice.abi, provider);
            const nftContract = new ethers.Contract(nftAddress, NFT.abi, provider);
            const nftBalance = await nftContract.balanceOf(accounts[0]);
            const bptBalance = await contract.balanceOf(accounts[0]);
            contract.on("GameOver", async (sender, event, winner, nftId) => {
                setLoading(false);
                let provider = new ethers.providers.Web3Provider(window.ethereum);
                const signer = provider.getSigner();
                const userAddress = await signer.getAddress();
                const wei = await provider.getBalance(diceAddress);
                setBalance(wei);
                if (sender === userAddress) {
                    setGameStatus("gameover");
                    const now = Tone.now();
                    if (winner) {
                        setWin(winner);
                        setMax(parseFloat(wei * 0.1));
                        synth.triggerAttackRelease("C4", "8n", now);
                        synth.triggerAttackRelease("E4", "8n", now + 0.25);
                        synth.triggerAttackRelease("G4", "8n", now + 0.5);
                        synth.triggerAttackRelease("C3", "8n", now + 0.75);
                        synth.triggerAttackRelease("E3", "8n", now + 1);
                        synth.triggerAttackRelease("G3", "8n", now + 1.25);
                        setTotal(ethers.utils.formatUnits("" + event, 18));
                    } else {
                        setTotal(ethers.utils.formatUnits("" + event, 18));
                        setWin(winner);
                        setMax(parseFloat(wei * 0.1));
                        synth.triggerAttackRelease("G2", "8n", now);
                        synth.triggerAttackRelease("E2", "8n", now + 0.25);
                        synth.triggerAttackRelease("C2", "8n", now + 0.5);
                    }
                    if (parseInt(bptBalance) == 0) {
                        await collectERC20();
                    }
                    setTimeout(() => {
                        setGameStatus("init");
                    }, 5000);
                }
                setBet(parseFloat((wei * 0.1) / 2));
                const played = await fetchGamesPlayed();
                setGamesPlayed(parseInt(played.gamesPlayed));
                setWinners(parseInt(played.winners));
                setlosers(parseInt(played.losers));
                setChartData([
                    { group: "losers", total: played.losers },
                    { group: "winners", total: played.winners },
                ]);
            });
        }
        if (typeof window.ethereum !== "undefined") {
            const agree = window.confirm("WARNING: PLAY AT YOUR OWN RISK");

            if (agree) {
                requestAccount();
            } else {
                alert("Thanks for visiting! 👋");
            }
        }
    }, []);

    async function fetchGamesPlayed() {
        if (typeof window.ethereum !== "undefined") {
            const provider = new ethers.providers.Web3Provider(window.ethereum);
            const contract = new ethers.Contract(diceAddress, Dice.abi, provider);
            try {
                const gamesPlayed = await contract.totalGamesPlayed();
                const winners = await contract.totalWinners();
                const losers = await contract.totalLosers();
                return {
                    gamesPlayed: gamesPlayed,
                    winners: winners,
                    losers: losers,
                };
            } catch (err) {
                console.log("Error: ", err);
            }
        }
    }

    return (
        <div className="App">
            <EthLogo total={total} win={win} setBet={handleChange} bet={bet} min={min} max={max} winners={winners} losers={losers} gamesPlayed={gamesPlayed} chartData={chartData} payWithMetamask={payWithMetamask} balance={parseInt(balance)} gameStatus={gameStatus} loading={loading} handleButtonClick={handleButtonClick} />
        </div>
    );
}

export default App;
