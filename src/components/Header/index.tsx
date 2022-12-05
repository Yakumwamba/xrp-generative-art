import { useState } from "react"
import Link from "next/link"
import { UserOutlined } from "@ant-design/icons"
import { Button, Divider, Modal, PageHeader, Dropdown, Menu, Space } from "antd"
import TextArea from "antd/lib/input/TextArea"
import { connectWallet, useAccountContext } from "contexts/accountContext"
import styles from "./Header.module.scss"

const Header = () => {
  const [accountState, accountDispatch] = useAccountContext()
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [seed, setSeed] = useState<string>()

  const generateWallet = () => {
    connectWallet(accountDispatch).then(() => hideModal())
  }

  const importWallet = () => {
    if (seed) {
      connectWallet(accountDispatch, seed).then(() => hideModal())
    }
  }

  const showModal = () => setIsModalVisible(true)

  const hideModal = () => setIsModalVisible(false)

  return (
    <div className={styles.header}>
      <PageHeader
        ghost={false}
        avatar={{
          src: "https://storage.googleapis.com/opensea-static/Logomark/Logomark-Blue.png",
        }}
        title={
          <Link href="/" className={styles.heading}>
            NFT Marketplace
          </Link>
        }
        subTitle="Generate artwork through AI, secure it as NFT"
        extra={
          <>
            <ul className={styles.headerList}>
              <Link href="/collections">
                <li>
                  <Space className={styles.navChild}>Collections</Space>
                </li>
              </Link>
              <li>
                <Space className={styles.navChild}>Stats</Space>
              </li>
              <li>
                <Dropdown
                  overlay={
                    <Menu>
                      <Menu.Item>Help Center</Menu.Item>
                      <Menu.Item>Docs</Menu.Item>
                    </Menu>
                  }
                  placement="bottom"
                  arrow
                >
                  <Space className={styles.navChild}>Learn</Space>
                </Dropdown>
              </li>
              <li>
                {accountState.account?.address ? (
                  <Dropdown
                    overlay={
                      <Menu>
                        <Menu.Item>Profile</Menu.Item>
                        <Link
                          href={`/user-nfts/${accountState.account.address}`}
                        >
                          <Menu.Item>My NFTs</Menu.Item>
                        </Link>
                        <Link href="/create">
                          <Menu.Item>Create</Menu.Item>
                        </Link>
                      </Menu>
                    }
                    placement="bottom"
                    arrow
                  >
                    <UserOutlined className={styles.userLogo} />
                  </Dropdown>
                ) : (
                  <Button
                    onClick={showModal}
                    className={styles.connectWallet}
                    loading={accountState.isLoading}
                  >
                    Connect Wallet
                  </Button>
                )}
              </li>
            </ul>
            {!accountState.account && (
              <Modal
                title="Generate a new wallet or recover from seed"
                visible={isModalVisible}
                onOk={hideModal}
                onCancel={hideModal}
                footer={null}
              >
                <TextArea
                  rows={4}
                  placeholder="Wallet seed/secret"
                  value={seed}
                  onChange={(e) => setSeed(e.target.value)}
                />
                <div className={styles.modalButtonContainer}>
                  <Button
                    loading={accountState.isLoading}
                    type="primary"
                    onClick={importWallet}
                    className={styles.importWalletButton}
                  >
                    Import Wallet
                  </Button>
                </div>
                <Divider plain>or</Divider>
                <div className={styles.modalButtonContainer}>
                  <Button
                    loading={accountState.isLoading}
                    type="primary"
                    onClick={generateWallet}
                    className={styles.generateWalletButton}
                  >
                    Generate New Wallet
                  </Button>
                </div>
              </Modal>
            )}
          </>
        }
      />
    </div>
  )
}

export default Header
