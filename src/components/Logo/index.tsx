'use client'

import { SvgIcon } from '@mui/material'

export type LogoProps = {
    fontSize: number
}

export default function Logo(props: LogoProps) {
    /*
     *  This component is the logo for the website. It takes a fontSize which sets the size of the logo.
     *  Currently it is just a placeholder logo, but it can be replaced with an actual logo later on.
     */
    return (
        <SvgIcon sx={{ fontSize: props.fontSize }}>
            <svg xmlns='http://www.w3.org/2000/svg' xmlnsXlink='http://www.w3.org/1999/xlink' version='1.1' width='500' height='500' viewBox='0 0 500 500' xmlSpace='preserve'>
                <desc>Created with Fabric.js 5.3.0</desc>
                <defs>
                </defs>
                <g transform='matrix(1.5700203772 0 0 1.5700203772 245.8175866957 207.9056995327)' id='Nsw1N--ZYFWvwSk9UsvlJ'  >
                    <path fill='#007DFC' transform=' translate(0, 0)' d='M -101.08797 130.66936 C -102.60596 131.15684000000002 -104.24473 131.11259 -105.73419 130.54388 L -119.94252 125.11888 L -119.94252 125.11888 C -132.58096 120.29329 -143.08744000000002 111.12394 -149.57851 99.25454 L -149.57851 99.25454 L -149.57851 99.25454 C -157.72684999999998 84.35471000000001 -158.56393 66.53369 -151.84812 50.93567000000001 L -151.17992999999998 49.383750000000006 L -151.17992999999998 49.383750000000006 C -145.46537999999998 36.111250000000005 -134.07211999999998 26.122060000000005 -120.16631999999998 22.192160000000005 L -111.96328999999999 19.873910000000006 L -113.41286999999998 2.768860000000007 L -113.41286999999998 2.768860000000007 C -114.55822999999998 -10.746399999999992 -108.93086999999998 -23.950729999999993 -98.38854999999998 -32.484989999999996 L -97.31231999999999 -33.35623 L -97.31231999999999 -33.35623 C -90.96908999999998 -38.49122 -83.59119999999999 -42.194959999999995 -75.68369999999999 -44.21388999999999 L -56.845179999999985 -49.02371999999999 L -59.04877999999999 -66.65248999999999 L -59.04877999999999 -66.65248999999999 C -60.93573999999999 -81.74819 -54.68949999999999 -96.71464999999998 -42.63116999999998 -105.99028999999999 L -42.33498999999998 -106.21811999999998 L -42.33498999999998 -106.21811999999998 C -33.022809999999986 -113.38133999999998 -21.603799999999982 -117.26518999999999 -9.855249999999984 -117.26518999999999 L -1.727079999999983 -117.26518999999999 L -5.959889999999983 -126.15026999999999 L -1.137999999999983 -127.96482999999999 L -1.137999999999983 -127.96482999999999 C 8.689580000000017 -131.66311 19.466320000000017 -131.99709 29.504040000000018 -128.91443999999998 L 31.962310000000016 -128.15948999999998 L 31.962310000000016 -128.15948999999998 C 43.975200000000015 -124.47025999999998 54.54917000000002 -117.14803999999998 62.22857000000002 -107.20083999999997 L 76.42924000000002 -88.80657999999997 L 76.42924000000002 -88.80657999999997 C 78.99541000000002 -85.48258999999997 81.97119000000002 -82.49607999999996 85.28592000000002 -79.91795999999997 L 86.15829000000002 -79.23944999999996 L 86.15829000000002 -79.23944999999996 C 89.86956000000002 -76.35290999999997 94.78494000000002 -75.52938999999996 99.23435000000002 -77.04870999999996 L 108.19438000000002 -80.10822999999996 L 108.19438000000002 -80.10822999999996 C 115.26321000000003 -82.52197999999996 122.86493000000003 -82.91753999999996 130.14611000000002 -81.25050999999996 L 134.02613000000002 -80.36217999999997 L 138.7564 -78.48825999999997 L 138.7564 -78.48825999999997 C 145.09088000000003 -75.97882999999997 150.39662 -71.41075999999997 153.81944000000001 -65.51947999999997 L 155.84889 -62.02643999999997 L 155.84889 -62.02643999999997 C 156.29419000000001 -61.25999999999997 156.44865000000001 -60.35885999999997 156.28402 -59.487879999999976 L 153.90768 -46.91589999999998 L 150.10052 -35.09707999999998 L 149.41926999999998 -43.95988999999997 L 149.41926999999998 -43.95988999999997 C 148.85666999999998 -51.279109999999974 145.21260999999998 -58.01516999999997 139.39425999999997 -62.491149999999976 L 139.39425999999997 -62.491149999999976 L 139.39425999999997 -62.491149999999976 C 135.86842 -65.20352999999997 131.73595999999998 -67.01795999999997 127.35294999999998 -67.77809999999998 L 124.39677999999998 -68.29078999999999 L 124.39677999999998 -68.29078999999999 C 116.94637999999998 -69.58290999999998 109.28003999999999 -68.13691999999999 102.81221999999998 -64.21961999999999 L 95.94561999999998 -60.06078999999999 L 95.94561999999998 -60.06078999999999 C 90.45948999999997 -56.73805999999999 83.41566999999998 -57.57745999999999 78.86402999999999 -62.09638999999999 C 74.44419999999998 -66.48445 70.00769999999999 -71.12294999999999 66.24240999999998 -76.12825 C 60.301769999999976 -84.02529 56.70249999999998 -88.34158 52.690109999999976 -93.22264 C 48.67771999999998 -98.1037 45.110349999999976 -102.76203 40.803019999999975 -105.56126 C 40.394399999999976 -105.82681000000001 39.96010999999997 -106.10424 39.55333999999998 -106.38415 L 39.55333999999998 -106.38415 C 32.045479999999976 -111.55048000000001 22.72793999999998 -113.36349 13.830669999999976 -111.38928 L 12.436419999999977 -111.07991 L 12.436419999999977 -111.07991 C 11.990469999999977 -110.98096 11.603359999999977 -110.70617 11.362829999999978 -110.31783 C 11.122299999999978 -109.92949 11.048729999999978 -109.4605 11.158799999999978 -109.01716 L 57.984209999999976 79.58519 z' />
                </g>
                <g transform='matrix(1.5216072845 0 0 1.5216072845 410.4904754791 220.9578328559)' id='oEklBZczwSCHACDnuNhTu'  >
                    <path fill='#007DFC' transform=' translate(0, 0)' d='M 45.91839 -57.78269 C 47.08048 -44.98053 44.61918 -41.24144 39.70553 -32.851350000000004 C 34.791880000000006 -24.461270000000006 35.236180000000004 -24.225030000000004 29.522160000000003 -15.533360000000002 C 23.80814 -6.841690000000002 9.246590000000005 11.69043 9.246590000000005 11.69043 L -16.377949999999995 39.807559999999995 L -44.1284 63.752759999999995 L -44.1284 63.752759999999995 C -45.83263 65.2233 -47.71324 66.47604 -49.72688 67.48209 L -53.95271 69.59341 L -53.95271 69.59341 C -55.330830000000006 70.28195000000001 -56.36565 71.50631 -56.81492 72.9799 L -58.20051 77.52449 L -58.20051 77.52449 C -58.38084 78.11595 -58.31105 78.75545 -58.00739 79.29409 C -57.70373 79.83273 -57.19271 80.22349 -56.59331 80.37537999999999 L -50.625080000000004 81.88775999999999 L -9.015610000000002 68.44279999999999 L -9.015610000000002 68.44279999999999 C -7.350540000000002 67.90477999999999 -6.018910000000002 66.64129 -5.394250000000002 65.00675 L -1.8158500000000024 55.643209999999996 L -13.204820000000003 58.41867 L -13.204820000000003 58.41867 C -13.605080000000003 58.51621 -14.021380000000004 58.33572 -14.223770000000004 57.9769 C -14.426160000000003 57.61807 -14.365290000000003 57.16843 -14.074770000000004 56.87634 L 2.9023299999999956 39.80757 L 24.634609999999995 14.708389999999998 L 41.530989999999996 -9.394170000000003 L 52.740669999999994 -28.206840000000003 L 52.740669999999994 -28.206840000000003 C 56.378409999999995 -34.31188 58.298809999999996 -41.286480000000005 58.298809999999996 -48.39314 L 58.298809999999996 -49.28679 L 58.298809999999996 -49.28679 C 58.298809999999996 -54.91978 57.46637 -60.521840000000005 55.828469999999996 -65.91144 L 54.45744 -70.42289 C 54.45744 -70.42289 53.52805 -73.58659999999999 51.39329 -76.4528 C 49.25853 -79.319 45.9184 -81.88771 45.9184 -81.88771 C 45.9184 -81.88771 44.75631 -70.58481 45.9184 -57.78266 z' />
                </g>
            </svg>
        </SvgIcon>
    )
}
