// import { useRouter } from "next/router"
import { Row } from "antd"
import MyNFT from "components/MyNFT/MyNFT"
import { useContext } from "react"
import { connectWallet, useAccountContext } from "contexts/accountContext"
import styles from "./MyNFTs.module.scss"
import router, { useRouter } from "next/router"


const MyNFTs = () => {
  /* We can pull NFTs using wallet address that comes from router.query.userAddress
  const router = useRouter()  */
  const router = useRouter()
  const [accountState, accountDispatch] = useAccountContext()
  const {nfts} = accountState
console.log("wallet has these NFTs" , nfts )
  //console.log("Account State => " , accountState )
  return (
    <div className={styles.nfts}> 
      <h2 className={styles.nftsTitle}>My NFTs</h2>
      <section className={styles.nftsGrid}>
        <Row gutter={{ xs: 8, sm: 16, md: 24, lg: 32 }}>
          {accountState.nfts.map((id) => (
          // @ts-ignore
            <MyNFT id={id.NFTokenID} key={id.NFTokenID} />
          ))}
        </Row>
      </section>
    </div>
  )
}

export default MyNFTs
