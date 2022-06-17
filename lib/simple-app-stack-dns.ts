import { Stack, StackProps } from "aws-cdk-lib";
import { Certificate, CertificateValidation, DnsValidatedCertificate, ICertificate } from "aws-cdk-lib/aws-certificatemanager";
import { IPublicHostedZone, PublicHostedZone } from "aws-cdk-lib/aws-route53";
import { Construct } from "constructs";


interface SimpleAppStackDnsProps extends StackProps {
    dnsName: string
}

export class SimpleAppStackDns extends Stack {

    public readonly hostedZone: IPublicHostedZone;
    public readonly certificate: ICertificate;

    constructor(scope: Construct, id: string, props: SimpleAppStackDnsProps){
        super(scope,id,props)
        this.hostedZone = new PublicHostedZone(this, 'SimpleAppHostedZone', {
            zoneName: props.dnsName,
        });

        this.certificate = new DnsValidatedCertificate(this, 'SimpleAppCertificateManager', {
            domainName: props.dnsName,
            hostedZone: this.hostedZone,
            region: 'us-east-1'
        });
    }
}








// interface SimpleAppStackDnsProps extends StackProps {
//     dnsName: string;
// }

// export class SimpleAppStackDns extends Stack{
//     public readonly hostedZone: IPublicHostedZone;
//     public readonly certificate: ICertificate;
   

//     constructor(scope: Construct, id: string, props: SimpleAppStackDnsProps) {
//         super(scope, id, props);
//         this.hostedZone = new PublicHostedZone(this, 'SimpleAppHostedZone', {
//             zoneName: props.dnsName,
//         });
//         this.certificate = new DnsValidatedCertificate(this, 'SimpleAppCertificateManager', {
//             domainName: props.dnsName,
//             hostedZone: this.hostedZone,
//             region: 'us-east-1'
//         });

        // this.certificate = new Certificate(this, 'SimpleAppCertificateManager', {
          
        //     domainName: props.dnsName,
        //     validation: CertificateValidation.fromDns(this.hostedZone)
            
        //  });
//     }
// }