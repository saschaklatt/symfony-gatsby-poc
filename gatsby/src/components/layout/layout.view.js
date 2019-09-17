/**
 * Layout component that queries for data
 * with Gatsby's useStaticQuery component
 *
 * See: https://www.gatsbyjs.org/docs/use-static-query/
 */

import React from "react"
import PropTypes from "prop-types"
import Header from "./header/header.view"
import Footer from "./footer/footer.view"

import "../../styles/_base.scss"
import styles from "./layout.module.scss"

const Layout = ({ children }) => (
  <>
    <Header />
    <main className={styles.content}>{children}</main>
    <Footer />
  </>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout