export const ZapIcon = ({
                            fill = "currentColor",
                            size = 24,
                            height,
                            width,
                            ...props
                        }: {
    fill?: string;
    size?: number;
    height?: number;
    width?: number;
    [key: string]: any;
}) => {
    return (
        <svg
            fill="none"
            height={size || height || 24}
            viewBox="0 0 24 24"
            width={size || width || 24}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <path
                d="M6.08997 13.28H9.17997V20.48C9.17997 22.16 10.09 22.5 11.2 21.24L18.77 12.64C19.7 11.59 19.31 10.72 17.9 10.72H14.81V3.52002C14.81 1.84002 13.9 1.50002 12.79 2.76002L5.21997 11.36C4.29997 12.42 4.68997 13.28 6.08997 13.28Z"
                stroke={fill}
                strokeWidth="1.5"
                strokeMiterlimit="10"
                strokeLinecap="round"
                strokeLinejoin="round"
            />
        </svg>
    );
};