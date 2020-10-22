import { wrapService } from '@typeswarm/cli';
import { StrictSpecification } from '@typeswarm/cli/lib/normalize';
import { setImageTag } from '@typeswarm/utils';
export interface BarkerOptions {
    image?: string;
    tag: string;

    dbUser: string;
    dbPassword: string;
    dbHost: string;
    dbPort?: number;
    dbName: string;

    serviceName?: string;
}
export const Barker: (options: BarkerOptions) => StrictSpecification = ({
    dbHost,
    dbName,
    dbPassword,
    dbUser,
    tag,
    dbPort = 3306,
    image = 'docker.pkg.github.com/corporateanon/barker/barker',
    serviceName = 'barker',
}) => {
    const service = wrapService({
        environment: {
            DB_DRIVER: 'mysql',
            DB_CONNECTION: `${dbUser}:${dbPassword}@tcp(${dbHost}:${dbPort})/${dbName}?charset=utf8mb4&parseTime=True&loc=Local`,
        },
    })
        .with(setImageTag({ image, tag }))
        .value();

    return {
        services: {
            [serviceName]: service,
        },
    };
};
