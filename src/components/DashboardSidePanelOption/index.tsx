import { Box, lighten, Typography } from '@mui/material'
import { theme } from '../ThemeRegistry/theme'
import { ReactElement } from 'react'

export type DashboardSidePanelOptionProps = {
    title: string
    icon: ReactElement
    onClick: () => void
    isSelected: boolean
    isDisabled: boolean
    isAddButton: boolean
}

function _getBackgroundColor(isDisabled: boolean, isAddButton: boolean, isSelected: boolean) {
    if (isDisabled) {
        return 'transparent'
    }
    if (isAddButton) {
        return theme.palette.secondary.main
    }
    if (isSelected) {
        return lighten(theme.palette.primary.light, 0.85)
    }
    return 'transparent'
}

function _getTitleColor(isDisabled: boolean, isAddButton: boolean, isSelected: boolean) {
    if (isDisabled) {
        return theme.palette.text.disabled
    }
    if (isAddButton) {
        return 'white'
    }
    if (isSelected) {
        return theme.palette.secondary.main
    }
    return theme.palette.text.secondary
}

function _getHoverBackgroundColor(isDisabled: boolean, isAddButton: boolean) {
    if (isDisabled) {
        return 'transparent'
    }
    if (isAddButton) {
        return theme.palette.secondary.main
    }
    return lighten(theme.palette.primary.light, 0.75)
}

function _getHoverTitleColor(isDisabled: boolean, isAddButton: boolean) {
    if (isDisabled) {
        return theme.palette.text.disabled
    }
    if (isAddButton) {
        return 'white'
    }
    return theme.palette.secondary.main
}

function _getBoxShadow(isDisabled: boolean, isAddButton: boolean) {
    if (isAddButton) {
        return 2
    } else {
        return 0
    }
}

export default function DashboardSidePanelOption(props: DashboardSidePanelOptionProps) {
    const { isDisabled, isSelected, isAddButton } = props

    const backgroundColor = _getBackgroundColor(isDisabled, isAddButton, isSelected)
    const titleColor = _getTitleColor(isDisabled, isAddButton, isSelected)

    const hoverBackgroundColor = _getHoverBackgroundColor(isDisabled, isAddButton)
    const hoverTitleColor = _getHoverTitleColor(isDisabled, isAddButton)

    const boxShadow = _getBoxShadow(isDisabled, isAddButton)

    return (
        <Box
            display='flex'
            gap='1rem'
            padding={'7px 16px'}
            borderRadius={60}
            bgcolor={backgroundColor}
            alignItems='center'
            data-cy={props.title}
            sx={{
                fontSize: '8px',
                color: titleColor,
                boxShadow: boxShadow,
                '&:hover': {
                    cursor: props.isDisabled ? 'auto' : 'pointer',
                    backgroundColor: hoverBackgroundColor,
                    boxShadow: boxShadow * 1.5,
                    color: hoverTitleColor,
                    '> *': {
                        color: hoverTitleColor,
                    },
                },
            }}
            onClick={props.isDisabled ? () => {} : props.onClick}
        >
            {props.icon}
            <Typography fontWeight={600} fontSize='14px'>{props.title}</Typography>
        </Box>
    )
}
