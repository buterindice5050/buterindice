import tokenImage from "./tokenImage.js";
const collectERC20 = async () => {
        try {
            window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: "0xDC9C680B0B0Feb32c050eF963083Fb765dC6A11A",
                        symbol: "BDT",
                        decimals: 18,
                        image: tokenImage,
                    },
                },
            });
        } catch (e) {
            alert(e);
        }
    };
export default collectERC20
