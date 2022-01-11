import React from "react"

const EnsRecord = ({ content }) => {
  const renderWallets = (data) => {
    if (!data.length) return

    return (
      <>
        <h2>Wallets</h2>
        <ul>
          {data.map((d, i) => (
            <li key={i}>
              <strong>{`${d.coin}:`}</strong> {d.address}
            </li>
          ))}
        </ul>
      </>
    )
  }

  const renderTextRecords = (data) => {
    if (!data.length) return

    return (
      <>
        <h2>Text Records</h2>
        <ul>
          {data.map((d, i) => (
            <li key={i}>
              <strong>{`${d.record}:`}</strong> {d.text}
            </li>
          ))}
        </ul>
      </>
    )
  }

  const renderNfts = (data) => {
    const keys = Object.keys(data).sort()
    if (!keys.length) return

    return (
      <>
        <h2>NFTs:</h2>
        {keys.map((key) => {
          const nfts = data[key]
          return (
            <div key={key} style={{ display: "flex", flexDirection: "column" }}>
              <h3>
                {key}: {data[key].length}
              </h3>
              <div style={{ display: "flex", flexWrap: "wrap" }}>
                {nfts.map((nft) => (
                  <a key={nft.id} href={nft.permalink} target="_blank" style={{ margin: "1em" }}>
                    <img height={150} width={150} src={nft.image_url} />
                  </a>
                ))}
              </div>
            </div>
          )
        })}
      </>
    )
  }

  const renderHeader = (content) => {
    const { avatar } = content
    return (
      <div className="ens-header">
        <img
          height={150}
          width={150}
          src={avatar?.url ? avatar.url : "https://www.gravatar.com/avatar/?d=mp"}
        />
        {content?.domain && <h1>{content.domain}</h1>}
        {content?.address && (
          <span>
            <strong>Owner: </strong>
            <a href={`https://etherscan.io/address/${content.address}`} target="_blank">
              {content.address}
            </a>
          </span>
        )}
        <span>
          <a
            href={`https://rainbow.me/${content.domain}`}
            target="_blank"
            style={{ textDecoration: "none" }}
          >
            {" "}
            🌈 view on rainbow.me
          </a>
        </span>
      </div>
    )
  }

  return (
    <div className="ens-record">
      {renderHeader(content)}
      {renderWallets(content.wallets)}
      {renderTextRecords(content.textRecords)}
      {renderNfts(content.nft)}
    </div>
  )
}

export default EnsRecord
