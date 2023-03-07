import { Grid } from "@nextui-org/react";
import PdfCard from "./cards/PdfCard";
import TextboxCard from "./cards/TextboxCard";

export default function MyCard() {
    return (
        <Grid.Container gap={2}>
            <Grid sm={24} md={10}>
                <PdfCard></PdfCard>
            </Grid>
            <Grid sm={24} md={10}>
                <TextboxCard></TextboxCard>
            </Grid>
        </Grid.Container>
    );
}