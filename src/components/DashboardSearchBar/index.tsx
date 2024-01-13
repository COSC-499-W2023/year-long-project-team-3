'use client'

import { InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import React from 'react'

export type DashboardSearchBarProps = {
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
}

export default function DashboardSearchBar(props: DashboardSearchBarProps) {
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
                        props.setSearchTerm(event.target.value)
                    }}
                    data-cy='dashboard-search-bar'
                />
            </div>
        </>
    )
}
