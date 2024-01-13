'use client'

import { InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import React from 'react'

export default function DashboardSearchBar() {
    return (
        <>
            <div className='dashboard-search-bar'>
                <TextField
                    type='text'
                    placeholder='Search'
                    variant='outlined' sx={{
                        '& .MuiInputBase-root.MuiOutlinedInput-root': {
                            width: '20vw',
                        },
                        '& .MuiInputBase-root.MuiOutlinedInput-root input': {
                            padding: '10.5px 14px',
                        },
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position='start'>
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                    onChange={(event) => {
                        console.log(event.target.value)
                    }}
                />
            </div>
        </>
    )
}
