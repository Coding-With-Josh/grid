const Page = ({params}: {params : {slug: string, name: string}}) => {
    return (
        <div>This project is named {params.name}</div>
    )
}

export default Page