import tokenImage from "./tokenImage.js";
const collectERC20 = async () => {
        try {
            window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC20",
                    options: {
                        address: "0xAA378bf51592aa4994aB8626788CC07B757622b1",
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
