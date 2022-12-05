import { useState } from "react"
import { UploadOutlined } from "@ant-design/icons"
import { Input } from "antd"
import styles from "components/UploadNFT/UploadNFT.module.scss"
import { Web3Storage } from 'web3.storage';


type UploadNFTType = {
  // eslint-disable-next-line no-unused-vars
  mintNft: (imageUrl: string, name: string, description: string) => void
}

const UploadNFT: React.FC<UploadNFTType> = ({ mintNft }) => {

  const [imageUrl, setImageUrl] = useState<string>()
const [nameInput, setNameInput] = useState<string>()
const [descriptionInput, setDescriptionInput] = useState<string>()
const [pinataResponse, setPinataResponse] = useState("");
const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEVGRDlmRDBkZTI2M2ZBMmY5YTRkMDA5MWNDRUU3YjQ3RTlFMDQwYWQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzAxNzUzOTA3NTgsIm5hbWUiOiJ4cnBfZ2VuZXJhdGl2ZV9haSJ9.yTWTdTEc_OEd6igRJl3JGp0Sd3jueJgxuFd5ieiM3a0');
const [imageBlob, setImageBlob] = useState<any>();
const [cid, setCid] = useState('');



const storage = new Web3Storage({ token });
const handleUpload = async (file: any) => {

  const cid = await storage.put([imageBlob])
  // if (!res?.ok) {
  //   throw new Error(`failed to get ${cid}`)
  // }

  console.log(cid)
};

const uploadImage = (image: Blob) => {
  const reader = new FileReader()
  reader.addEventListener("load", () => {
    const uploadedImage = reader.result 
   
    if (typeof uploadedImage === "string") {
      setImageUrl(uploadedImage)
    }
  })

reader.readAsDataURL(image)
  reader.onload = async () => {
  //handleUpload(image);
  setImageBlob(image);
  }
}


mintNft = async  (imageUrl, nameInput, descriptionInput) => {
  handleUpload(imageBlob);
  console.log("cid", cid);
  console.log("MINTING THIS NFT" + imageUrl, nameInput, descriptionInput)
}


  return (
    <div className={styles.uploadCard}>
      <label htmlFor="input" className={styles.uploadButton}>
        <UploadOutlined className={styles.uploadIcon} />
      </label>
      <input
        id="input"
        type="file"
        accept="image/jpeg, image/png, image/jpg"
        onChange={(e) => uploadImage(e.target.files![0])}
        style={{ display: "none" }}
      />
      <div className={styles.uploadDisplayImage}>
        {imageUrl && <img src={imageUrl} alt="uploaded nft image" />}
      </div>
      {imageUrl && (
        <>
          <div className={styles.uploadInputContainer}>
            <Input
              placeholder="NFT Name"
              defaultValue={nameInput}
              onChange={(e) => setNameInput(e.target.value)}
            />
            <Input
              placeholder="NFT Description"
              defaultValue={descriptionInput}
              onChange={(e) => setDescriptionInput(e.target.value)}
            />
          </div>
          <button
            className={styles.uploadMintNftButton}
            onClick={() =>
              mintNft(imageUrl, nameInput as string, descriptionInput as string)
            }
          >
            Mint NFT
          </button>
        </>
      )}
    </div>
  )
}

export default UploadNFT





