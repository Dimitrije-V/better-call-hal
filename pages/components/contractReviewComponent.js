import { Grid } from "@nextui-org/react";
import PdfCard from "../cards/PdfCard";
import TextboxCard from "../cards/TextboxCard";
import styles from "../index.module.css"

export default function ContractReviewComponent() {
    return (
        <Grid.Container justify="center" gap={2}>
            <Grid sm={24} md={10}>
                <PdfCard></PdfCard>
            </Grid>
            <Grid sm={24} md={10}>
                <p className={styles.or}>OR</p>
            </Grid>
            <Grid sm={24} md={10}>
                <TextboxCard></TextboxCard>
            </Grid>
        </Grid.Container >
    );
}