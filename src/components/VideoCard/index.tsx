import { Box } from '@mui/material'
import Image from 'next/image'
import { useRouter } from 'next/navigation'

export type VideoCardProps = {
    videoId: string
    title: string
    thumbnailUrl: string | null
}

export default function VideoCard(props: VideoCardProps) {
    const router = useRouter()

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
            }}
            onClick={handleOnClick}
        >
            {!!props.thumbnailUrl && (
                <Image
                    src={props.thumbnailUrl}
                    width={230}
                    height={200}
                    quality={2}
                    alt={props.title}
                    objectPosition={'100% 0'}
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
                <Box padding={'8px'} fontSize={'14px'} lineHeight={'150%'} fontWeight={500}>
                    {props.title}
                </Box>
            </Box>
        </Box>
    )

    function handleOnClick() {
        router.push(`/video/${ props.videoId }`)
    }
}
