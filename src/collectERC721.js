import tokenImage from "./tokenImage.js";
const collectERC721 = async (id) => {
        try {
            window.ethereum.request({
                method: "wallet_watchAsset",
                params: {
                    type: "ERC721",
                    options: {
                        address: "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512",
                        symbol: "BDTX",
                        id: id,
                        image: tokenImage,
                    },
                },
            });
        } catch (e) {
            alert(e);
        }
    };
export default collectERC721
