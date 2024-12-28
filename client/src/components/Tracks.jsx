import React from 'react'

const Tracks = ({tracks}) => {
  return (
    <div>
        {tracks.map((e, i) => {
            return (
                <div key={i}>
                    <p>Song Title: {e.name}</p>
                    <p>Play Count: {e.playcount}</p>
                    <p>Listeners: {e.listeners}</p>
                </div>
            )
        })}
    </div>
  )
}

export default Tracks