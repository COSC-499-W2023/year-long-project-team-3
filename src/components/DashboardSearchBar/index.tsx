'use client'

import { InputAdornment, TextField } from '@mui/material'
import SearchIcon from '@mui/icons-material/Search'
import ClearIcon from '@mui/icons-material/Clear'
import React from 'react'

export type DashboardSearchBarProps = {
    searchTerm: string
    setSearchTerm: React.Dispatch<React.SetStateAction<string>>
}

export default function DashboardSearchBar(props: DashboardSearchBarProps) {
    return (
        <>
            <div className='dashboard-search-bar'>
                <TextField
                    type='text'
                    placeholder='Search'
                    autoComplete='off'
                    variant='outlined'
                    sx={{
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
                        endAdornment: (
                            <InputAdornment
                                position='end'
                                onClick={() => props.setSearchTerm('')}
                                sx={{
                                    cursor: 'pointer',
                                }}
                            >
                                <ClearIcon />
                            </InputAdornment>
                        ),
                    }}
                    onChange={(event) => {
                        props.setSearchTerm(event.target.value)
                    }}
                    value={props.searchTerm}
                    data-cy='dashboard-search-bar'
                />
            </div>
        </>
    )
}
