import React from "react";
import Image from "next/image";

const PartnerLogos: React.FC = () => {
    return (
        <section className="my-28" id="partners">
            <div className="overflow-x-auto">
                <div className="flex gap-8 items-center min-w-[600px] px-4">
                    <Image
                        src="/images/mtnrwanda.png"
                        width={112}
                        height={40}
                        className="w-28 h-auto mx-auto filter grayscale"
                        alt="mtn-rwanda-logo"
                    />
                    <Image
                        src="/images/kcb.png"
                        width={112}
                        height={96}
                        className="h-24 mx-auto filter grayscale"
                        alt="kcb-logo"
                    />
                    <Image
                        src="/images/equity.png"
                        width={112}
                        height={40}
                        className="w-28 h-auto mx-auto filter grayscale"
                        alt="equity-logo"
                    />
                    <Image
                        src="/images/bralirwa.png"
                        width={112}
                        height={40}
                        className="w-28 h-auto mx-auto filter grayscale"
                        alt="bralirwa-logo"
                    />
                </div>
            </div>
        </section>
    );
};

export default PartnerLogos;
