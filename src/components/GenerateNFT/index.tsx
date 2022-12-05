import { useState } from "react"
import { Input, Button } from "antd"
import styles from "components/GenerateNFT/GenerateNFT.module.scss"
import { Web3Storage } from 'web3.storage';
const { TextArea } = Input

type GenerateNFTType = {
  // eslint-disable-next-line no-unused-vars
  mintNft: (imageUrl: string, name: string, description: string) => void
}

const GenerateNFT: React.FC<GenerateNFTType> = ({ mintNft }) => {
  const [generatedImageURL, setImageUrl] = useState<string>()
  const [imageInput, setImageInput] = useState<string>()
  const [isGenerateLoading, setIsGenerateLoading] = useState<boolean>()
  const [nameInput, setNameInput] = useState<string>()
  const [descriptionInput, setDescriptionInput] = useState<string>()
  const [imageBlob, setImageBlob] = useState<any>();
  const [cid, setCid] = useState('');
  const [token, setToken] = useState('eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweEVGRDlmRDBkZTI2M2ZBMmY5YTRkMDA5MWNDRUU3YjQ3RTlFMDQwYWQiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NzAxNzUzOTA3NTgsIm5hbWUiOiJ4cnBfZ2VuZXJhdGl2ZV9haSJ9.yTWTdTEc_OEd6igRJl3JGp0Sd3jueJgxuFd5ieiM3a0');
  /* const [isMintLoading, setIsMintLoading] = useState<boolean>(); */

  const storage = new Web3Storage({ token });



  const handleGenerate = async (promptText: string) => {
    // Stop the form from submitting and refreshing the page.

    // Get data from the form.

    setImageInput(promptText)

    // Send the data to the server in JSON format.
    const JSONdata = JSON.stringify(imageInput)

    // API endpoint where we send form data.
    const endpoint = "/api/generate_art"

    // Form the request for sending data to the server.
    const options = {
      // The method is POST because we are sending data.
      method: "POST",
      // Tell the server we're sending JSON.
      headers: {
        "Content-Type": "application/json",
      },
      // Body of the request is the JSON data we created above.
      body: JSONdata,
    }

    // Send the form data to our forms API on Vercel and get a response.
    const response = await fetch(endpoint, options)

    // Get the response data from server as JSON.
    // If server returns the name submitted, that means the form works.
    const result = await response.json()
    setImageUrl(result.imageURL)
    // generate blob from image url and setImageBlob 
 
    console.log("Image has been loaded ...waiting for one more step")
    console.log(`Generative Art prompt text: ${result.imageURL}`)
    setIsGenerateLoading(false)
  }

  const generateImage = async () => {
    setIsGenerateLoading(true)
    setImageUrl("")
    await handleGenerate(imageInput ? imageInput : "No prompt text provided")

    setImageInput("")
  }

  const handleUpload = async (file: any) => {

    const cid = await storage.put([imageBlob])
    // if (!res?.ok) {
    //   throw new Error(`failed to get ${cid}`)
    // }
  
    console.log(cid)
  };
  const mintGeneratedImage = async  (generatedImageURL: string) => {
   // const responseBlob = await fetch(imageUrl)
    // use fetch to avoid CORS issues with IPFS images 
    // no-cors-fetch is not working
    const responseBlob = await fetch("/api/generate_art")
    //const responseBlob = await fetch(imageUrl)

    //const blob = await responseBlob
    console.log(await responseBlob.json())
    //setImageBlob(blob)

    // await handleUpload(imageBlob);
    // console.log("cid", cid);
    // console.log("MINTING THIS NFT" + generatedImageURL, nameInput, descriptionInput)
  }


  return (
    <div className={styles.generateCard}>
      <TextArea
        rows={4}
        placeholder="Type something for text-to-image AI"
        className={styles.generateTextArea}
        value={imageInput}
        onChange={(e) => setImageInput(e.target.value)}
      />
      <Button
        type="primary"
        size="large"
        className={styles.generateButton}
        onClick={generateImage}
        loading={isGenerateLoading}
      >
        Generate
      </Button>

      <div className={styles.generateDisplayImage}>
        {generatedImageURL && <img src={generatedImageURL} alt="generateed nft image" />}
      </div>

      {generatedImageURL && (
        <>
          <div className={styles.generateInputContainer}>
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
          <Button
            type="primary"
            size="large"
            className={styles.generateMintNftButton}
            onClick={() => {
              mintGeneratedImage(generatedImageURL)
              console.log("MINTING THIS NFT" + generatedImageURL, );
            }
            
            }
          >
            Mint NFT
          </Button>
        </>
      )}
    </div>
  )
}

export default GenerateNFT
