import React from 'react'
import {InputLabel, Select, MenuItem, Button, Grid, Typography} from '@material-ui/core'
import { commerce } from '../../library/commerce'
import { useForm, FormProvider } from 'react-hook-form'
import FormInput from './CustomTextField'
import { useState } from 'react'
import { useEffect } from 'react'
import { Link } from 'react-router-dom'

const AddressForm = ({ checkoutToken, next }) => {
  const [shippingCountries, setShippingCountries] = useState([])
  const [shippingCountry, setShippingCountry] = useState('')
  const [shippingSubdivisions, setShippingSubdivisions] = useState([])
  const [shippingSubdivision, setShippingSubdivision] = useState('')
  const [shippingOptions, setShippingOptions] = useState([])
  const [shippingOption, setShippingOption] = useState([])

  const methods = useForm()

  const countries = Object.entries(shippingCountries).map(([code, name]) => ({id: code, label: name}))
  const subdivisions = Object.entries(shippingSubdivisions).map(([code, name]) => ({id: code, label: name}))
  const options = shippingOptions.map((sO) => ({ id: sO.id, label: `${sO.description} - (${sO.price.formatted_symbol_with_symbol})` }))

  const fetchShippingCountries = async (checkoutTokenId) => {
    const { countries } = await commerce.services.localeListShippingCountries(checkoutTokenId)

    setShippingCountries(countries)
    setShippingCountry(Object.keys(countries)[0])
  }

  const fetchSubdivisions = async (countryCode) => {
    const { subdivisions } = await commerce.services.localeListSubdivisions(countryCode)

    setShippingSubdivisions(subdivisions)
    setShippingSubdivision(Object.keys(subdivisions)[0])
  }

  const fetchShippingOptions = async (checkoutTokenId, country, region = null) => {
    const  options  = await commerce.checkout.getShippingOptions(checkoutTokenId, { country, region })

    setShippingOptions(options)
    setShippingOption(options[0].id)
  }

  useEffect(() => {
    fetchShippingCountries(checkoutToken.id)
  }, [])

  useEffect(() => {
    if(shippingCountry) fetchSubdivisions(shippingCountry)
  }, [shippingCountry])

  useEffect(() => {
    if(shippingSubdivision) fetchShippingOptions(checkoutToken.id, shippingCountry, shippingSubdivision)
  }, [shippingSubdivision])

  return (
   <>
    <Typography variant='h6' gutterBottom>Shipping Address</Typography>
    <FormProvider { ...methods}>
      <form onSubmit={methods.handleSubmit((data) => next({ ...data, shippingCountry, shippingSubdivision, shippingOption}))}>
        <Grid container spacing={3}>
          <FormInput name="firstname" label='First Name' required/>
          <FormInput name="lastname" label='Last Name' required />
          <FormInput name="address1" label='Address' required/>
          <FormInput name="email" label='Email' required/>
          <FormInput name="city" label='City' required/>
          <FormInput name="zip" label='ZIP / Postal Code' required/>
          <Grid item xs={12} sm={6}>
            <InputLabel>Shipping Country</InputLabel>
            <Select value={shippingCountry} fullWidth onChange={(e) => setShippingCountry(e.target.value)}>
             {countries.map((country) => (
                <MenuItem key={country.id} value={country.id}> {country.label} </MenuItem>
            ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Shipping Subdivision</InputLabel>
            <Select value={shippingSubdivision} fullWidth onChange={(e) => setShippingSubdivision(e.target.value)}>
             {subdivisions.map((subdivision) => (
                <MenuItem key={subdivision.id} value={subdivision.id}> {subdivision.label} </MenuItem>
            ))}
            </Select>
          </Grid>
          <Grid item xs={12} sm={6}>
            <InputLabel>Shipping Options</InputLabel>
            <Select value={shippingOption} fullWidth onChange={(e) => setShippingOption(e.target.value)}>
            {options.map((option) => (
                <MenuItem key={option.id} value={option.id}> {option.label} </MenuItem>
            ))}
            </Select>
          </Grid>
        </Grid>
        <br />
        <div style={{ display: 'flex', justifyContent: 'space-between'}}>
          <Button component={Link} to ='/cart' variant='outlined' >Back to Cart</Button>
          <Button type='submit' variant='contained' color='primary' >Next</Button>
        </div>
      </form>
    </FormProvider>
   </>
  )
}

export default AddressForm;