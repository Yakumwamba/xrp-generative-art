import { Col, Button, Input } from "antd"
import { useContext, useState } from "react"

import styles from "./MyNFT.module.scss"

type MyNFTType = {
  id?: number
}

// eslint-disable-next-line no-unused-vars
const MyNFT: React.FC<MyNFTType> = ({ id }) => {
  const [isCreatingOffer, setIsCreatingOffer] = useState(false)
  const [offer, setOffer] = useState("")
  // get account from context and retrieve account nfts 

  

  return (
    <Col span={6}>
      <article className={styles.nftsCard}>
        <img
          src="https://w0.peakpx.com/wallpaper/284/26/HD-wallpaper-portrait-display-vertical-artwork-digital-art-space-stars-milky-way-planet-blue.jpg"
          alt="nft collection image"
        />
        <div
          className={`${styles.nftsCardTextContainer} ${
            isCreatingOffer && styles.nftsCardSecondTextContainer
          }`}
        >
          <p className={styles.nftsCardTitle}>NFT Name Here</p>
        
          <p className={styles.nftsCardTitle}> {id}</p>
          {isCreatingOffer ? (
            <>
              <div className={styles.nftsInputContainer}>
                <Input
                  placeholder="In XRP"
                  onChange={(e) => setOffer(e.target.value)}
                  defaultValue={offer}
                  className={styles.nftsOfferInput}
                />
              </div>
              <div className={styles.nftsSecondButtonContainer}>
                <Button
                  className={styles.nftsCancelButton}
                  onClick={() => {
                    setOffer("")
                    setIsCreatingOffer(false)
                  }}
                >
                  Cancel
                </Button>

                <Button className={styles.nftsSellButton}>Create</Button>
              </div>
            </>
          ) : (
            <div className={styles.nftsButtonContainer}>
              <Button
                type="primary"
                className={styles.nftsSellButton}
                onClick={() => setIsCreatingOffer(true)}
              >
                Create Sell Offer
              </Button>

              <Button danger className={styles.nftsBurnButton}>
                Burn
              </Button>
            </div>
          )}
        </div>
      </article>
    </Col>
  )
}

export default MyNFT
