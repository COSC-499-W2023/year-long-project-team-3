import { Box, Typography } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export type VideoCardProps = {
    videoId: string
    title: string
    thumbnailUrl: string | null
    handleVideoClick: any
}

export default function VideoCard(props: VideoCardProps) {
    return (
        <Box
            width={230}
            height={200}
            display={'flex'}
            alignItems={'center'}
            position={'relative'}
            boxShadow={'0px 4px 12px rgba(0, 0, 0, 0.25)'}
            sx={{
                '&:hover': {
                    cursor: 'pointer',
                    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.5)',
                    borderRadius: '8px',
                },
                borderRadius: '8px',
                backgroundColor: 'black',
                overflow: 'hidden',
            }}
            onClick={() => props.handleVideoClick(props.videoId)}
        >
            {!!props.thumbnailUrl && (
                <Image
                    src={props.thumbnailUrl}
                    layout={'fill'}
                    alt={props.title}
                    objectPosition={'center'}
                    objectFit={'cover'}
                    style={{ borderRadius: '4px' }}
                />
            )}

            <Box
                width={'100%'}
                position={'absolute'}
                bottom={0}
                left={0}
                bgcolor={'white'}
                borderRadius={'0 0 4px 4px'}
            >
                <Box
                    component='span'
                    sx={{ display: 'block', height: '1px', width: '100%', backgroundColor: '#E7E7ED' }}
                />

                <Box padding={'8px'}>
                    <Typography noWrap fontSize='14px' lineHeight='150%' fontWeight={500}>
                        {props.title}
                    </Typography>
                </Box>
            </Box>
        </Box>
    )
}
