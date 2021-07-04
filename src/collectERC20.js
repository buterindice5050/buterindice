import tokenImage from "./tokenImage.js";
const collectERC20 = async () => {
        try {
            window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
                        symbol: "BDT",
                        decimals: 18,
                        image: tokenImage
                    },
                },
            });
        } catch (e) {
            alert(e);
        }
    };
export default collectERC20
