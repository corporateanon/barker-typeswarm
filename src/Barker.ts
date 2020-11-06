import { wrapService } from '@typeswarm/cli';
import { StrictSpecification } from '@typeswarm/cli/lib/normalize';
import { setImageTag } from '@typeswarm/utils';
export interface BarkerOptions {
    image?: string;
    tag: string;

    workerImage?: string;
    workerTag: string;

    dbUser: string;
    dbPassword: string;
    dbHost: string;
    dbPort?: number;
    dbName: string;

    serviceName?: string;
    workerServiceName?: string;
}
export const Barker: (options: BarkerOptions) => StrictSpecification = ({
    dbHost,
    dbName,
    dbPassword,
    dbUser,
    tag,
    workerTag,
    image = 'docker.pkg.github.com/corporateanon/barker/barker',
    workerImage = 'docker.pkg.github.com/corporateanon/barker-worker/barker-worker',
    dbPort = 3306,
    serviceName = 'barker',
    workerServiceName = 'barker-worker',
}) => {
    const service = wrapService({
        environment: {
            DB_DRIVER: 'mysql',
            DB_CONNECTION: `${dbUser}:${dbPassword}@tcp(${dbHost}:${dbPort})/${dbName}?charset=utf8mb4&parseTime=True&loc=Local`,
        },
    })
        .with(setImageTag({ image, tag }))
        .value();

    const workerService = wrapService({
        environment: {
            BARKER_URL: `http://${serviceName}:3000`,
        },
    })
        .with(setImageTag({ image: workerImage, tag: workerTag }))
        .value();

    return {
        services: {
            [serviceName]: service,
            [workerServiceName]: workerService,
        },
    };
};
