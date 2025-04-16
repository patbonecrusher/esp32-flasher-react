//import PropTypes from 'prop-types'
import * as React from 'react'
// import Switch from '@mui/material/Switch'

const Esp32 = ({ esp, api }) => {
  return (
    <div className="esp-container">
      <h3>{esp.path}</h3>
    </div>
  )
}

// Esp.propTypes = {
//   esp: PropTypes.shape({
//     address: PropTypes.string.isRequired,
//     packet: PropTypes.shape({
//       answers: PropTypes.arrayOf(
//         PropTypes.shape({
//           rdata: PropTypes.shape({
//             mac: PropTypes.string
//           })
//         })
//       )
//     })
//   }).isRequired
// }

export default Esp32
